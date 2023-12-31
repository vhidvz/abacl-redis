# ABACL - Redis Driver

[![npm](https://img.shields.io/npm/v/abacl-redis)](https://www.npmjs.com/package/abacl-redis)
![npm](https://img.shields.io/npm/dm/abacl-redis)
[![Coverage](https://raw.githubusercontent.com/vhidvz/abacl-redis/main/coverage-badge.svg)](https://htmlpreview.github.io/?https://github.com/vhidvz/abacl-redis/blob/main/docs/coverage/lcov-report/index.html)
[![GitHub](https://img.shields.io/github/license/vhidvz/abacl-redis?style=flat)](https://github.com/vhidvz/abacl-redis/blob/main/LICENSE)
[![documentation](https://img.shields.io/badge/documentation-click_to_read-c27cf4)](https://vhidvz.github.io/abacl-redis/)
[![Build, Test and Publish](https://github.com/vhidvz/abacl-redis/actions/workflows/npm-ci.yml/badge.svg)](https://github.com/vhidvz/abacl-redis/actions/workflows/npm-ci.yml)

[ABACL](https://www.npmjs.com/package/abacl) redis storage driver to store policies in your redis.

## Quick Start

### Installation

```sh
npm install --save abacl-redis
```

## Use Redis Driver

```ts
import { RedisDriver } from 'abacl-redis';
import { AccessControl } from 'abacl';

const ac = new AccessControl([], { driver: RedisDriver.build(/* Redis | RedisOptions */) });

// OR

const ac = new AccessControl([], { driver: () => RedisDriver.build(/* Redis | RedisOptions */) });
```

## License

[MIT](https://github.com/vhidvz/abacl-redis/blob/master/LICENSE)
