# redux-loadings

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

A tool to handle network IO with redux.

Try to get out of `actions`, `middlewares`, `reducers`, `redux-thunk`, `redux-promise`, `redux-saga`, maybe even `dva` with `dva-loading`.

## Docs

[Get Started](https://github.com/dancerphil/redux-loadings/blob/develop/GetStarted.md)

[Document](https://github.com/dancerphil/redux-loadings/blob/develop/Document.md)

[Migrate from 0.2 to 0.3](https://github.com/dancerphil/redux-loadings/blob/develop/Document.md)

## Example

```bash
git clone https://github.com/dancerphil/redux-loadings.git
cd example
npm i
npm start
```

## ScreenShots

![](https://github.com/dancerphil/redux-loadings/blob/master/screenshot.gif)

## TODO

- [x] 0.3.0 make dispatch & getState inline & you don't need to surround dispatch: dispatch(load(...)) ==> load(...)
- [x] 0.3.0 build own middleware, deprecate redux-thunk or make it an inline dependency
- [ ] more examples
- [ ] release es version
- [ ] release 1.0
