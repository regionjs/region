# redux-loadings

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

For those who uses `redux` to manage you data, and loads data from api.

You are writing these with `redux-thunk`, `redux-promise`, `redux-saga`, maybe even `dva` with `dva-loading`.

You may not need them. You may not need to write `actions`, `middlewares`, `reducers`, and you may not need to write anything about async stuff.
 
Just write as:

```jsx harmony
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { load, mapResultToProps } from 'redux-loadings';
import LoadingComponent from './LoadingComponent'
import DisplayComponent from './DisplayComponent'
import { fetchUser, fetchFollower } from './api'; // somewhere with axios

class ControlComponent extends PureComponent {
  componentDidMount() {
    load('user', fetchUser);
    load('follower', fetchFollower);
  }

  render() {
    const { loading, user, follower } = this.props;
    if(loading) {
      return (
        <LoadingComponent />
      );
    }
    return (
      <DisplayComponent user={user} follower={follower} />
    );
  }
}

const mapStateToProps = mapResultToProps(['user', 'follower']);

export default connect(mapStateToProps)(ControlComponent);
```

## Document
see: [Document](https://github.com/dancerphil/redux-loadings/blob/develop/Document.md)

## Migrate from 0.2 to 0.3
see: [MigrateGuide](https://github.com/dancerphil/redux-loadings/blob/develop/Document.md)

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
