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

`expiredTime`, `enableLog` and `strictLoading` are optional.

The default `expiredTime` is `300,000` ms.

The default `enableLog` is `true`, which logs when `env !== 'production'`.

The default `strictLoading` is `true`, which treat `loading === undefined` as `true`. If you set it to false, `loading === undefined` will be treated as `undefined`

This is useful if you have two different panel renders two parts of data. The `undefined` part is not used at first and it toggles loading when user switch the panel.

```javascript
setConfig({
  store,
  reducerPath: 'result',
  expiredTime: 300000,
  enableLog: true,
  strictLoading: true
});
```

### load

```javascript
import { load } from 'redux-loadings';
load(key, Promise, props);

// inside load
const { params, forceUpdate, format } = props;
```

`Promise` is a function returns a promise.

`param` is what `Promise` may need. Throttle is important, so Promise is not called at once.

`forceUpdate: true | false`, default as `false`, throttles if the last load call is in the past 5 minutes.

`forceUpdate: true` calls Promise at once.

`format` effects after Promise resolved and before result is stored, you may do some heavy-calculating task and side effects. It may be something like `(result, snapshot) => result.map(...)`.

`snapshot` is the preview result, it is useful when you try to merge the result of `POST/PUT/DELETE` method.

> `redux-saga` has its `throttle` effect, it throttles saga calls. While `redux-loadings` throttles before Promise calls.

### connectWith

```javascript
import { connectWith } from 'redux-loadings';

const DisplayComponent = ({ user }) => {...};
const LoadingComponent = ({ user }) => {...}; // or just import one
const EnhancedComponent = connectWith('user', DisplayComponent, LoadingComponent);

// or
const DisplayComponent = ({ user, follower }) => {...};
const EnhancedComponent = connectWith(['user', 'follower'], DisplayComponent, LoadingComponent);

// or
const EnhancedComponent = connectWith({ loading: 'user', result: ['user', 'follower'] }, DisplayComponent, Loading);
```

`loading === true` if `user.loading === true || follower.loading === true`.

You can provide the loading component renders part of the data.

### mapResultToProps

```javascript
const mapStateToProps = mapResultToProps('user');
// or
const mapStateToProps = mapResultToProps(['user', 'follower']);
// or 
const mapStateToProps = mapResultToProps({ loading: 'user', result: ['user', 'follower'] });
```

### getLoading & getResults & getFetchTimes

```javascript
const loading = getLoading(['user', 'follower']);
const user = getResults('user');
const [user, follower] = getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = getFetchTimes(['user', 'follower']);
}
```

`getFetchTimes` returns `date.getTime()` the moment result is resolved and stored.
