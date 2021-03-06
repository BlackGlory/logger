# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.3.4](https://github.com/BlackGlory/logger/compare/v0.3.3...v0.3.4) (2021-07-13)

### [0.3.3](https://github.com/BlackGlory/logger/compare/v0.3.2...v0.3.3) (2021-07-12)

### [0.3.2](https://github.com/BlackGlory/logger/compare/v0.3.1...v0.3.2) (2021-07-03)

### [0.3.1](https://github.com/BlackGlory/logger/compare/v0.3.0...v0.3.1) (2021-06-21)


### Features

* add /health ([0fd9bba](https://github.com/BlackGlory/logger/commit/0fd9bba76db3cc261f9034f91f0b913430f29df2))


### Bug Fixes

* docker build ([7757c65](https://github.com/BlackGlory/logger/commit/7757c6547b7f28422310b04f860ec6a1ffe526c2))

## [0.3.0](https://github.com/BlackGlory/logger/compare/v0.2.1...v0.3.0) (2021-04-27)


### ⚠ BREAKING CHANGES

* The database schema has been upgraded.

* rename ([5710ea6](https://github.com/BlackGlory/logger/commit/5710ea642a644df8101a026565da761619078f5a))

### [0.2.1](https://github.com/BlackGlory/logger/compare/v0.2.0...v0.2.1) (2021-03-17)

## 0.2.0 (2021-03-14)


### ⚠ BREAKING CHANGES

* rename /api to /admin
* /stats => /metrics
* POST /api/logger/:id/purge => POST /api/logger/:id/purge-policies
* the database needs to be rebuilt.

### Features

* add /api/logger/:id/purge ([60db9fb](https://github.com/BlackGlory/logger/commit/60db9fb29418be3ee0d733728e7798e5bd1b4554))
* add DAO about delete permission ([ce4317d](https://github.com/BlackGlory/logger/commit/ce4317db4e2b9f8c789970ea77b658320a139d9b))
* add features execpt since and elimination policies support ([7b8d384](https://github.com/BlackGlory/logger/commit/7b8d384f8af754d313d4aa7411ddf63df3668c7a))
* add indexes ([ebf1fdf](https://github.com/BlackGlory/logger/commit/ebf1fdf6f10945533a5f74b114c3e26ad058d3f3))
* add list ([9cef06c](https://github.com/BlackGlory/logger/commit/9cef06c1ac3d88a4860cfdbd4f1cdc51006c7974))
* add logger DAO ([d73980d](https://github.com/BlackGlory/logger/commit/d73980d7438b7baa1fea8179c67215ab88e9f893))
* add message id ([fad0769](https://github.com/BlackGlory/logger/commit/fad076974688cdbf2b245947f0a97583d85e0e98))
* add purge apis ([61a5773](https://github.com/BlackGlory/logger/commit/61a57733c07db3cc53fe79d542ca5663f31d384d))
* add robots.txt ([b165c4a](https://github.com/BlackGlory/logger/commit/b165c4a728b0939ebffe890ffbcdaaa2b5b08611))
* auto vacuum ([82d9cca](https://github.com/BlackGlory/logger/commit/82d9ccadd85c5898a49ee8efd76db363d921f551))
* custom ajv options ([a272d9f](https://github.com/BlackGlory/logger/commit/a272d9ffa714b93f2fb616862bba39728bb68cc0))
* disable auto_vacuum ([5c40af9](https://github.com/BlackGlory/logger/commit/5c40af9e04c89aa7a1eea240f9e98b28417cd3ca))
* handle back-pressure for follow ([695368c](https://github.com/BlackGlory/logger/commit/695368cecdb34b24349514b306ac8c5256f4896f))
* handle back-pressure for query ([99baf46](https://github.com/BlackGlory/logger/commit/99baf46bffb6168cc2d78fe84112ad4d0f1f5a84))
* memoize environments ([eae8082](https://github.com/BlackGlory/logger/commit/eae80822d63f5427efaf1898b10c17be1704a02c))
* modify the purge api ([8dd3da3](https://github.com/BlackGlory/logger/commit/8dd3da34465d410a2c82984e52804db8ef8f8e1f))
* oneOf => anyOf ([68cb31b](https://github.com/BlackGlory/logger/commit/68cb31b51992d9fe81fe4e22e638f920c3b92746))
* port features from PubSub ([e55e75e](https://github.com/BlackGlory/logger/commit/e55e75e52cc91d9a3d500b33526aabb30f0d2db7))
* prometheus metrics ([f0a66c4](https://github.com/BlackGlory/logger/commit/f0a66c457cd4aaf4b016bbee5a2b5448224394a4))
* remove indexes ([9186ef2](https://github.com/BlackGlory/logger/commit/9186ef2e23311d096a43170ff6bae3398210bb2b))
* rename /api to /admin ([6488cd1](https://github.com/BlackGlory/logger/commit/6488cd1660d9af5a9c1b0b5bc201789afe88d75d))
* rename stats to metrics ([b1b57c0](https://github.com/BlackGlory/logger/commit/b1b57c064eaf6c5add1cfe37c547c1f28ced1ad2))
* support JSON streaming(ndjson) ([97728c5](https://github.com/BlackGlory/logger/commit/97728c541b4fd9bd509e00d5ff199e0409457378))
* support Last-Event-ID for SSE ([2366ea1](https://github.com/BlackGlory/logger/commit/2366ea1b57210dd891a7594417eb109b3fdb92fc))
* support LOGGER_DATA ([83f5b8a](https://github.com/BlackGlory/logger/commit/83f5b8a144bf9ef3f7985db8ca97755bf78500fc))
* support pm2 ([f45a2dd](https://github.com/BlackGlory/logger/commit/f45a2dd045c6488acfdf9b063c2d5476e4baf3bd))
* support querystring since ([a8d0ee1](https://github.com/BlackGlory/logger/commit/a8d0ee129a6a3a74a80d4aa3bef5dddc7fb35cb0))
* support sse heartbeat ([793c326](https://github.com/BlackGlory/logger/commit/793c326642741182d5e88be2c721d17939c59487))
* support ws heartbeat ([89ad5b6](https://github.com/BlackGlory/logger/commit/89ad5b6821d58a3039da8b7de31710832223784d))


### Bug Fixes

* docker build ([b278355](https://github.com/BlackGlory/logger/commit/b278355b655dc8c5450e832b4f863f9a88bbebb4))
* examples ([10dde39](https://github.com/BlackGlory/logger/commit/10dde396ef6e92479a4b634ae6cf0841bd6fc252))
* process.on ([4617100](https://github.com/BlackGlory/logger/commit/4617100992f42a0acd83ca08f7a0feb8ff567ec3))
* query ([9dfcf8d](https://github.com/BlackGlory/logger/commit/9dfcf8d43f9388c64c63d5bfdd5e59b7652986e4))
* query ([9a4f221](https://github.com/BlackGlory/logger/commit/9a4f2219b3fc961f1495dbd9e622a734ff6a4ad8))
* query, getAllLoggerIds ([034121b](https://github.com/BlackGlory/logger/commit/034121b98e2ed11c94ffefb260625d85c24a20ed))
* schema ([baefdba](https://github.com/BlackGlory/logger/commit/baefdba74db27f627d10192662298845371c7218))
* streams ([1370e82](https://github.com/BlackGlory/logger/commit/1370e8268ba54acfe6834e54236609dbb6a12aa5))


* database ([288efb9](https://github.com/BlackGlory/logger/commit/288efb9c992121a8fbef607a3537c4c514c9ddf7))
