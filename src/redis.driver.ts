import { CacheInterface, CacheInterfaceOptions, CacheKey, OK, Policy, SEP } from 'abacl';
import { Redis, RedisOptions } from 'ioredis';

import { key, pattern } from './tools.tools';

export const PREFIX = 'abacl';
export type RedisDriverOptions = CacheInterfaceOptions;
export const DefaultRedisDriverOptions = { sep: SEP, prefix: PREFIX };

export class RedisDriver<Sub = string, Act = string, Obj = string> implements CacheInterface<Sub, Act, Obj> {
  protected instance: Redis;

  constructor(
    client: Redis | RedisOptions,
    protected options: RedisDriverOptions = DefaultRedisDriverOptions,
  ) {
    options.sep = options.sep || SEP;
    options.prefix = options.prefix || PREFIX;

    if (client instanceof Redis) this.instance = client;
    else this.instance = new Redis(client);
  }

  async clear(): Promise<typeof OK> {
    const { sep, prefix } = this.options;

    const keys = await this.instance.keys(`${prefix}${sep}*`);
    await Promise.all(keys.map((key) => this.instance.del(key)));

    return OK;
  }

  async get<T = string, M = string, S = string>(cKey: CacheKey<T, M, S>): Promise<Policy<Sub, Act, Obj>[]> {
    const p = pattern(cKey, this.options);

    const policies: Policy<Sub, Act, Obj>[] = [];
    for (const index of Object.keys(this.present)) {
      if (p.test(index)) policies.push(this.present[index]);
    }

    return policies;
  }

  async set(policy: Policy<Sub, Act, Obj>): Promise<typeof OK> {
    this.present[key(policy, this.options)] = policy;
    return OK;
  }

  async del(policy: Policy<Sub, Act, Obj>): Promise<typeof OK> {
    delete this.present[key(policy, this.options)];
    return OK;
  }

  async has(policy: Policy<Sub, Act, Obj>): Promise<boolean> {
    return key(policy, this.options) in this.present;
  }

  static build<Sub = string, Act = string, Obj = string>(
    client: Redis | RedisOptions,
    options: RedisDriverOptions = DefaultRedisDriverOptions,
  ) {
    return new RedisDriver<Sub, Act, Obj>(client, options);
  }
}
