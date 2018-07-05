# redux-loadings

Yes, you use `redux` to manage you data, and you are loading data from api.

You are writing these with `redux-actions`, `redux-thunk`, `redux-promise`, `redux-saga`, maybe even `dva` with `dva-loading`.

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
    const { dispatch } = this.props;
    dispatch(load('user', fetchUser));
    dispatch(load('follower', fetchFollower));
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

## Example

```bash
git clone https://github.com/dancerphil/redux-loadings.git
cd example
npm i
npm start
```

## Document

### load

```javascript
dispatch(load(key, Promise, config));

// inside load
const { params, forceUpdate, format } = config;
```

`param` is what `Promise` may need. Throttle is important, so Promise is not called at once.

`forceUpdate: 'always' | 'need' | 'never'`, default as `need`, throttles if the last load call is in the past 5 minutes.

`forceUpdate: 'always'` calls Promise at once and `forceUpdate: 'never'` calls Promise only if there is no result.

`format` effects after Promise resolved and before result is stored, you may do some heavy-calculating task. It may be something like `result => result.map(...)`.

> `redux-saga` has its `throttle` effect, it throttles saga calls. While `redux-loadings` throttles before Promise calls.

### asyncLoad

```javascript
dispatch(async (dispatch, getState) => {
  const result = await asyncLoad(dispatch, getState, key, Promise, config);
  // do something with result
);
```

Sometimes we want access result to do some side effect task, use `asyncLoad`. It performed as `load` and returns result.

If Promise is not called, which means load is throttled, `asyncLoad` returns the last result.

> `redux-saga` deals async stuff with generator and yield, which is like `co`.
> While `async` and `await` was widely implemented, `co-style` will be finally outdated to me.

### mapResultToProps

```javascript
const mapStateToProps = mapResultToProps(['user', 'follower']);
// gets
const { loading, user, follower } = this.props;


const mapStateToProps = mapResultToProps('user');
// gets
const { loading, user } = this.props;
```

`loading === true` if `user.loading === true || follower.loading === true`, `loading === false` if `user.loading === (false | undefined) && follower.loading === (false | undefined)`

If you have a transparent loading layer, dom will render part of the data while loading.

If `fetchUser` is called, while `fetchFollower` not, `loading` will still turns `false`, and requires the handle of `follower === undefined`.

This is useful if you have two different panel renders two parts of data. The `undefined` part is not used at first and it toggles loading when user switch the panel.

### getLoading & getResults & getFetchTimes

```javascript
const mapStateToProps = (state) => {
  const loading = getLoading(state, ['user', 'follower']);
  const [user, follower] = getResults(state, ['user', 'follower']);
  const [userFetchTime, followerFetchTime] = getFetchTimes(state, ['user', 'follower']);
  // ...other
  return { loading, user, follower, ... };
}
```

You may need to map other things to props.

`getFetchTimes` returns `date.getTime()` the moment result is resolved and stored.

```javascript
const mapStateToProps = (state) => {
  const loading = getLoading(state, 'user');
  const [user, follower] = getResults(state, ['user', 'follower']);
  return { loading, user, follower };
}
```

This is useful when some results are optional. In this case, Component needs `user` to render, but `follower` can be displayed later. 

## TODO

- [ ] release 0.1.0
