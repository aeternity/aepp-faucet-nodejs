# Changelog

## [1.4.0](https://github.com/aeternity/aepp-faucet-nodejs/compare/v1.3.0...v1.4.0) (2026-09-24)


### Features

* ability to pass recipient address from the url ([c520604](https://github.com/aeternity/aepp-faucet-nodejs/commit/c520604d7b36181c28f307a04d7cc76162071960))
* add cors ([ae1e006](https://github.com/aeternity/aepp-faucet-nodejs/commit/ae1e0066bcbcbe189ea6d0e46c4c195d24b33c22))
* add cors ([f5ec67c](https://github.com/aeternity/aepp-faucet-nodejs/commit/f5ec67c181a773b04e7cc27a314aa81fe6214ebe))
* add wallet connect button, version at the bottom ([#33](https://github.com/aeternity/aepp-faucet-nodejs/issues/33)) ([9f9cbf0](https://github.com/aeternity/aepp-faucet-nodejs/commit/9f9cbf0c0ba9a60fa330f5e145ed2a19647a4e33))
* Ceres compatibility by updating sdk to 13.3.2 ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))
* show network name instead network url, and related fixes ([#36](https://github.com/aeternity/aepp-faucet-nodejs/issues/36)) ([e16817b](https://github.com/aeternity/aepp-faucet-nodejs/commit/e16817b5dec0328dfb33865b4e83fc2715f64237))


### Bug Fixes

* code formatting ([201dbbf](https://github.com/aeternity/aepp-faucet-nodejs/commit/201dbbf881d7065c12f5a72db37235563bb9cacc))
* code formatting ([7faf169](https://github.com/aeternity/aepp-faucet-nodejs/commit/7faf169c985a973b6d9a4e6b710340a3029b907f))
* don't duplicate AE suffix ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))
* don't graylist if top up failed ([#45](https://github.com/aeternity/aepp-faucet-nodejs/issues/45)) ([09c0e19](https://github.com/aeternity/aepp-faucet-nodejs/commit/09c0e194ae5735cf785689c608d01f1bb0c1e444))
* repository urls ([fbb5202](https://github.com/aeternity/aepp-faucet-nodejs/commit/fbb52023d5a4b9a424ed45f2a175f686d97eb6ab))
* simultaneous requests ([6b6368d](https://github.com/aeternity/aepp-faucet-nodejs/commit/6b6368de3497e4aeb868097638e7982deca35e7b))
* specify error status in case of unknown exception ([bc1eaae](https://github.com/aeternity/aepp-faucet-nodejs/commit/bc1eaae85d8531df121cdd9f5c8ff3c538c3b55b))


### Performance Improvements

* avoid extra requests by managing nonce locally ([c1cab6b](https://github.com/aeternity/aepp-faucet-nodejs/commit/c1cab6bba0d450c275ef9e914e0133a7b4a5f9f4))


### Miscellaneous Chores

* build server before running, update deps, show version ([#40](https://github.com/aeternity/aepp-faucet-nodejs/issues/40)) ([7f61abd](https://github.com/aeternity/aepp-faucet-nodejs/commit/7f61abdf906b205ee095b3ebd7956bff6efbbe98))
* bump @aeternity/aepp-sdk to 15.0.0 ([#48](https://github.com/aeternity/aepp-faucet-nodejs/issues/48)) ([e621fa8](https://github.com/aeternity/aepp-faucet-nodejs/commit/e621fa81adf5e69129267f0c9bbc715be5c60992))
* copy only required files ([cf7a1bc](https://github.com/aeternity/aepp-faucet-nodejs/commit/cf7a1bcdb325033a6822d067cf2af9bd94d7be17))
* copy only required files ([4f1a736](https://github.com/aeternity/aepp-faucet-nodejs/commit/4f1a7368422455a299d5bf4655ca5acc6d53d2fb))
* copy package*.json separately to enable docker caching ([21d87dc](https://github.com/aeternity/aepp-faucet-nodejs/commit/21d87dc458fc4094476358f5c508cc4dd5a264ba))
* **deps:** update sdk to 14 ([#44](https://github.com/aeternity/aepp-faucet-nodejs/issues/44)) ([fec30ac](https://github.com/aeternity/aepp-faucet-nodejs/commit/fec30ac0b39fbd0abed95da3f1ec029a4528666b))
* **master:** release 1.1.0 ([#29](https://github.com/aeternity/aepp-faucet-nodejs/issues/29)) ([b8e5364](https://github.com/aeternity/aepp-faucet-nodejs/commit/b8e5364c208408d2392e8f1d67504572c80e1141))
* **master:** release 1.2.0 ([#38](https://github.com/aeternity/aepp-faucet-nodejs/issues/38)) ([30f55b8](https://github.com/aeternity/aepp-faucet-nodejs/commit/30f55b83c6f94a62f2f83c256c79d6ee86b95b59))
* **master:** release 1.2.1 ([#46](https://github.com/aeternity/aepp-faucet-nodejs/issues/46)) ([699404a](https://github.com/aeternity/aepp-faucet-nodejs/commit/699404a5e2c994e9447ad8dbff138d490b07ea5c))
* **master:** release aepp-faucet 1.3.0 ([#52](https://github.com/aeternity/aepp-faucet-nodejs/issues/52)) ([f84f6b8](https://github.com/aeternity/aepp-faucet-nodejs/commit/f84f6b83b88f9f19afa4e97b5a730a295d992f26))
* switch to not generalized account for testing ([4737c3b](https://github.com/aeternity/aepp-faucet-nodejs/commit/4737c3b362ab71e233ea97e4b262f166bc48e53f))
* update node to the latest lts version ([5d78615](https://github.com/aeternity/aepp-faucet-nodejs/commit/5d78615372232f1722473546c3b5c923ba8aeb13))
* update npm dependencies in server ([7473f37](https://github.com/aeternity/aepp-faucet-nodejs/commit/7473f37c62586a90c9949f129c0b6ab19405ee4b))
* update sdk to 12.1.3 ([ac9accb](https://github.com/aeternity/aepp-faucet-nodejs/commit/ac9accb9cbbd2f5aee2a44e7c7d11d6d3460f3bd))
* update sdk to 13.0.0 ([f8ed256](https://github.com/aeternity/aepp-faucet-nodejs/commit/f8ed2568f74da6e18c9ddb584d1b5806227cc442))

## [1.3.0](https://github.com/aeternity/aepp-faucet-nodejs/compare/aepp-faucet-v1.2.1...aepp-faucet-v1.3.0) (2026-09-24)


### Features

* ability to pass recipient address from the url ([c520604](https://github.com/aeternity/aepp-faucet-nodejs/commit/c520604d7b36181c28f307a04d7cc76162071960))
* add cors ([ae1e006](https://github.com/aeternity/aepp-faucet-nodejs/commit/ae1e0066bcbcbe189ea6d0e46c4c195d24b33c22))
* add cors ([f5ec67c](https://github.com/aeternity/aepp-faucet-nodejs/commit/f5ec67c181a773b04e7cc27a314aa81fe6214ebe))
* add wallet connect button, version at the bottom ([#33](https://github.com/aeternity/aepp-faucet-nodejs/issues/33)) ([9f9cbf0](https://github.com/aeternity/aepp-faucet-nodejs/commit/9f9cbf0c0ba9a60fa330f5e145ed2a19647a4e33))
* Ceres compatibility by updating sdk to 13.3.2 ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))
* show network name instead network url, and related fixes ([#36](https://github.com/aeternity/aepp-faucet-nodejs/issues/36)) ([e16817b](https://github.com/aeternity/aepp-faucet-nodejs/commit/e16817b5dec0328dfb33865b4e83fc2715f64237))


### Bug Fixes

* code formatting ([201dbbf](https://github.com/aeternity/aepp-faucet-nodejs/commit/201dbbf881d7065c12f5a72db37235563bb9cacc))
* code formatting ([7faf169](https://github.com/aeternity/aepp-faucet-nodejs/commit/7faf169c985a973b6d9a4e6b710340a3029b907f))
* don't duplicate AE suffix ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))
* don't graylist if top up failed ([#45](https://github.com/aeternity/aepp-faucet-nodejs/issues/45)) ([09c0e19](https://github.com/aeternity/aepp-faucet-nodejs/commit/09c0e194ae5735cf785689c608d01f1bb0c1e444))
* repository urls ([fbb5202](https://github.com/aeternity/aepp-faucet-nodejs/commit/fbb52023d5a4b9a424ed45f2a175f686d97eb6ab))
* simultaneous requests ([6b6368d](https://github.com/aeternity/aepp-faucet-nodejs/commit/6b6368de3497e4aeb868097638e7982deca35e7b))
* specify error status in case of unknown exception ([bc1eaae](https://github.com/aeternity/aepp-faucet-nodejs/commit/bc1eaae85d8531df121cdd9f5c8ff3c538c3b55b))


### Performance Improvements

* avoid extra requests by managing nonce locally ([c1cab6b](https://github.com/aeternity/aepp-faucet-nodejs/commit/c1cab6bba0d450c275ef9e914e0133a7b4a5f9f4))


### Miscellaneous Chores

* build server before running, update deps, show version ([#40](https://github.com/aeternity/aepp-faucet-nodejs/issues/40)) ([7f61abd](https://github.com/aeternity/aepp-faucet-nodejs/commit/7f61abdf906b205ee095b3ebd7956bff6efbbe98))
* bump @aeternity/aepp-sdk to 15.0.0 ([#48](https://github.com/aeternity/aepp-faucet-nodejs/issues/48)) ([e621fa8](https://github.com/aeternity/aepp-faucet-nodejs/commit/e621fa81adf5e69129267f0c9bbc715be5c60992))
* copy only required files ([cf7a1bc](https://github.com/aeternity/aepp-faucet-nodejs/commit/cf7a1bcdb325033a6822d067cf2af9bd94d7be17))
* copy only required files ([4f1a736](https://github.com/aeternity/aepp-faucet-nodejs/commit/4f1a7368422455a299d5bf4655ca5acc6d53d2fb))
* copy package*.json separately to enable docker caching ([21d87dc](https://github.com/aeternity/aepp-faucet-nodejs/commit/21d87dc458fc4094476358f5c508cc4dd5a264ba))
* **deps:** update sdk to 14 ([#44](https://github.com/aeternity/aepp-faucet-nodejs/issues/44)) ([fec30ac](https://github.com/aeternity/aepp-faucet-nodejs/commit/fec30ac0b39fbd0abed95da3f1ec029a4528666b))
* **master:** release 1.1.0 ([#29](https://github.com/aeternity/aepp-faucet-nodejs/issues/29)) ([b8e5364](https://github.com/aeternity/aepp-faucet-nodejs/commit/b8e5364c208408d2392e8f1d67504572c80e1141))
* **master:** release 1.2.0 ([#38](https://github.com/aeternity/aepp-faucet-nodejs/issues/38)) ([30f55b8](https://github.com/aeternity/aepp-faucet-nodejs/commit/30f55b83c6f94a62f2f83c256c79d6ee86b95b59))
* **master:** release 1.2.1 ([#46](https://github.com/aeternity/aepp-faucet-nodejs/issues/46)) ([699404a](https://github.com/aeternity/aepp-faucet-nodejs/commit/699404a5e2c994e9447ad8dbff138d490b07ea5c))
* switch to not generalized account for testing ([4737c3b](https://github.com/aeternity/aepp-faucet-nodejs/commit/4737c3b362ab71e233ea97e4b262f166bc48e53f))
* update node to the latest lts version ([5d78615](https://github.com/aeternity/aepp-faucet-nodejs/commit/5d78615372232f1722473546c3b5c923ba8aeb13))
* update npm dependencies in server ([7473f37](https://github.com/aeternity/aepp-faucet-nodejs/commit/7473f37c62586a90c9949f129c0b6ab19405ee4b))
* update sdk to 12.1.3 ([ac9accb](https://github.com/aeternity/aepp-faucet-nodejs/commit/ac9accb9cbbd2f5aee2a44e7c7d11d6d3460f3bd))
* update sdk to 13.0.0 ([f8ed256](https://github.com/aeternity/aepp-faucet-nodejs/commit/f8ed2568f74da6e18c9ddb584d1b5806227cc442))

## [1.2.1](https://github.com/aeternity/aepp-faucet-nodejs/compare/v1.2.0...v1.2.1) (2024-11-20)


### Bug Fixes

* don't graylist if top up failed ([#45](https://github.com/aeternity/aepp-faucet-nodejs/issues/45)) ([09c0e19](https://github.com/aeternity/aepp-faucet-nodejs/commit/09c0e194ae5735cf785689c608d01f1bb0c1e444))

## [1.2.0](https://github.com/aeternity/aepp-faucet-nodejs/compare/v1.1.0...v1.2.0) (2024-06-24)


### Features

* add wallet connect button, version at the bottom ([#33](https://github.com/aeternity/aepp-faucet-nodejs/issues/33)) ([9f9cbf0](https://github.com/aeternity/aepp-faucet-nodejs/commit/9f9cbf0c0ba9a60fa330f5e145ed2a19647a4e33))
* show network name instead network url, and related fixes ([#36](https://github.com/aeternity/aepp-faucet-nodejs/issues/36)) ([e16817b](https://github.com/aeternity/aepp-faucet-nodejs/commit/e16817b5dec0328dfb33865b4e83fc2715f64237))

## [1.1.0](https://github.com/aeternity/aepp-faucet-nodejs/compare/v1.0.0...v1.1.0) (2024-04-23)


### Features

* Ceres compatibility by updating sdk to 13.3.2 ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))


### Bug Fixes

* don't duplicate AE suffix ([35cf806](https://github.com/aeternity/aepp-faucet-nodejs/commit/35cf806cc55d352bf7ab7c420bce8d5ae85a4063))

## 1.0.0 (2023-11-14)


### Features

* ability to pass recipient address from the url ([c520604](https://github.com/aeternity/aepp-faucet-nodejs/commit/c520604d7b36181c28f307a04d7cc76162071960))
* add cors ([f5ec67c](https://github.com/aeternity/aepp-faucet-nodejs/commit/f5ec67c181a773b04e7cc27a314aa81fe6214ebe))


### Bug Fixes

* code formatting ([7faf169](https://github.com/aeternity/aepp-faucet-nodejs/commit/7faf169c985a973b6d9a4e6b710340a3029b907f))
* repository urls ([fbb5202](https://github.com/aeternity/aepp-faucet-nodejs/commit/fbb52023d5a4b9a424ed45f2a175f686d97eb6ab))
* simultaneous requests ([6b6368d](https://github.com/aeternity/aepp-faucet-nodejs/commit/6b6368de3497e4aeb868097638e7982deca35e7b))
* specify error status in case of unknown exception ([bc1eaae](https://github.com/aeternity/aepp-faucet-nodejs/commit/bc1eaae85d8531df121cdd9f5c8ff3c538c3b55b))


### Performance Improvements

* avoid extra requests by managing nonce locally ([c1cab6b](https://github.com/aeternity/aepp-faucet-nodejs/commit/c1cab6bba0d450c275ef9e914e0133a7b4a5f9f4))
