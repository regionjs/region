# Private API

[中文版](https://github.com/dancerphil/redux-loadings/blob/master/docs/PrivateAPI-zh_CN.md)

### getProvider

If you are using your own store, create a file named `Provider.js`, then write:

```javascript
import { getProvider } from 'redux-loadings';
import store, { reducers } from './store';

const Provider = getProvider({ store, reducers });

export default Provider;
```

> No need to import sideEffect if you do so

### load#forceUpdate

```javascript
import { load } from 'redux-loadings';

load(key, asyncFunction, { params, forceUpdate, format });

// or
const result = await load(key, Promise, { params, forceUpdate, format });
```

`forceUpdate: true | false`, default as `false`, throttles if the last load call is in the past time that is set. If you don't config expireTime, you may not use forceUpdate.

`forceUpdate: true` calls Promise at once.

### setConfig

Use new Region instead of setConfig.

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
