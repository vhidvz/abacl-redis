import { Redis } from 'ioredis';
import { OK } from 'abacl';

import { RedisDriver } from '../src';
import { policies } from './mock';

describe('test redis driver', () => {
  let client: Redis;
  let driver: RedisDriver;

  it('should define driver', async () => {
    client = Redis.createClient();
    driver = RedisDriver.build(client);

    expect(driver).toBeDefined();
  });

  it('should set policies', async () => {
    for (const policy of policies) expect(await driver.set(policy)).toBe(OK);
  });

  it('should has policies', async () => {
    for (const policy of policies) {
      expect(await driver.has(policy)).toBeTruthy();
    }
  });

  it('should get policies', async () => {
    const policies = await driver.get({ action: { strict: false, main: 'read', scope: 'own' } });
    expect(policies).toHaveLength(3);
  });

  it('should del policies', async () => {
    expect(await driver.del(policies[0])).toBe(OK);

    expect(await driver.has(policies[0])).toBeFalsy();
  });

  it('should clear policies', async () => {
    expect(await driver.clear()).toBe(OK);

    expect(await driver.get({})).toHaveLength(0);
  });

  afterAll(async () => {
    await client.quit();
  });
});
