/* eslint-disable @typescript-eslint/no-explicit-any */
import { ALL, ANY, CacheKey, ControlOptions, NULL, Pattern, Policy, PropType, PropValue, SEP, STRICT } from 'abacl';

import { DefaultRedisDriverOptions, PREFIX, RedisDriverOptions } from './driver';

export const redisIgnore = (sep: string) => `[^${sep}]*`;

export function parse<T = string, M = string, S = string>(
  prop: T,
  options: RedisDriverOptions = DefaultRedisDriverOptions,
): PropValue<M, S> {
  options.sep = options.sep || SEP;
  options.prefix = options.prefix || PREFIX;

  const { sep, prefix } = options;

  if (prefix) prop = String(prop).replace(prefix + sep, '') as T;
  const [main, scope] = String(prop).split(sep) as [M, S];
  return { main, scope };
}

export function key<Sub = string, Act = string, Obj = string>(
  polity: Policy<Sub, Act, Obj>,
  options: RedisDriverOptions = DefaultRedisDriverOptions,
): string {
  options.sep = options.sep || SEP;
  options.prefix = options.prefix || PREFIX;

  const { sep, prefix } = options;

  const subject = parse(polity.subject, options);
  const action = parse(polity.action, options);
  const object = parse(polity.object, options);

  const subject_key = `${subject.main}${sep}${subject.scope ?? NULL}`;
  const action_key = `${action.main}${sep}${action.scope ?? ANY}`;
  const object_key = `${object.main}${sep}${object.scope ?? ALL}`;

  if (!prefix) return [subject_key, action_key, object_key].join(sep);
  else return [prefix, subject_key, action_key, object_key].join(sep);
}

export function pattern<T = string, M = string, S = string>(
  cKey: CacheKey<T, M, S>,
  options: RedisDriverOptions = DefaultRedisDriverOptions,
): Pattern {
  options.sep = options.sep || SEP;
  options.prefix = options.prefix || PREFIX;

  const { sep, prefix } = options;

  const ignore = redisIgnore(sep);

  const strict = <T = string>(prop: T, options?: ControlOptions) => (options?.strict ?? STRICT ? prop : ignore);

  const regex = (prop?: PropType): string => {
    if (prop && prop in cKey) {
      const { main, scope } = typeof cKey[prop]!.val === 'string' ? parse(cKey[prop]!.val) : (cKey[prop]!.val as PropValue<M, S>);

      const val = scope ?? ((prop === 'subject' && NULL) || (prop === 'action' && ANY) || (prop === 'object' && ALL));

      return `${main}${sep}${strict(val, { strict: cKey[prop]!.strict })}`;
    } else return [ignore, ignore].join(sep);
  };

  if (!prefix) return RegExp(`${[regex('subject'), regex('action'), regex('object')].join(sep)}`);
  else return RegExp(`${[prefix, regex('subject'), regex('action'), regex('object')].join(sep)}`);
}
