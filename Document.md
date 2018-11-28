# Document

### Provider

You are recommended not to use redux. Use Provider to surround your App.

```javascript
import { Provider } from 'redux-loadings';

<Provider>...</Provider>
```

### load

```javascript
import { load } from 'redux-loadings';

load(key, Promise, { params, forceUpdate, format });

// or
const result = await load(key, Promise, { params, forceUpdate, format });
```

`Promise` is a function returns a promise.

`param` is what `Promise` may need. Promise is called when needed and pass the `param`.

`forceUpdate: true | false`, default as `false`, throttles if the last load call is in the past 5 minutes.

`forceUpdate: true` calls Promise at once.

`format` effects after promise resolved and before result is stored, you may do some heavy-calculating task and side effects. It may be something like `(result, snapshot) => result.map(...)`.

`snapshot` is the preview result, it is useful when you try to merge the result of `POST/PUT/DELETE` method.

### set

```javascript
import { set } from 'redux-loadings';

set(key, result);
```

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

LoadingComponent receives data as well. You can provide the loading component renders part of the data.

### setConfig

It is optional.

```javascript
setConfig({
  store,
  reducerPath: 'result',
  expiredTime: 300000,
  enableLog: true,
  strictLoading: true
});
```

The default `expiredTime` is `300,000` ms. You can set it to 0 if you don't want throttle.

The default `enableLog` is `true`, which logs when `env !== 'production'`.

The default `strictLoading` is `true`, which treat `loading === undefined` as `true`. If you set it to false, `loading === undefined` will be treated as `undefined` and not computed with others.

This is useful if you have two different panel renders two parts of data. The `undefined` part is not used at first and it toggles loading when user switch the panel.

If you use reducer from `redux-loadings`, store and reducerPath is needed.

```javascript
import { reducer as result, setConfig } from 'redux-loadings';

const reducer = combineReducers({ result });
// ...
const store = compose(middleware)(createStore)(reducer);
setConfig({ store, reducerPath: 'result' });
```

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
