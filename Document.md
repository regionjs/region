# Document

### setConfig

`redux-loadings` needs `store` passed. If you use combineReducers, the reducer path should be told.

```javascript
import { reducer as result, setConfig } from 'redux-loadings';

const reducer = combineReducers({ result });
// ...
const store = compose(middleware)(createStore)(reducer);
setConfig({ store, reducerPath: 'result' });
```

`expiredTime` and `enableLog` are optional. The default `expiredTime` is `300,000` ms. The default `enableLog` is `env !== 'production''`.

```javascript
setConfig({
  store,
  reducerPath: 'result',
  expiredTime: 300000,
  enableLog: false
});
```

### load

```javascript
load(key, Promise, props);

// inside load
const { params, forceUpdate, format, willSetResult, didSetResult } = props;
```

`Promise` is a function returns a promise.

`param` is what `Promise` may need. Throttle is important, so Promise is not called at once.

`forceUpdate: 'always' | 'need' | 'never'`, default as `need`, throttles if the last load call is in the past 5 minutes.

`forceUpdate: 'always'` calls Promise at once and `forceUpdate: 'never'` calls Promise only if there is no result.

`format` effects after Promise resolved and before result is stored, you may do some heavy-calculating task. It may be something like `(result, snapshot) => result.map(...)`.

`snapshot` is the preview result, it is useful when you try to merge the result of `POST/PUT/DELETE` method.

> `redux-saga` has its `throttle` effect, it throttles saga calls. While `redux-loadings` throttles before Promise calls.

`willSetResult` and `didSetResult` calls as `didSetResult({ dispatch, getState, result, snapshot })`. Notice that if `didSetResult` dispatch nothing, the change will not be rendered immediately. 

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
