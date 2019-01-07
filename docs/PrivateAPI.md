# Private API

[中文版](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

### getProvider

If you are using your own store, create a file named `Provider.js`, then write:

```javascript
import { getProvider } from 'region-shortcut';
import store, { reducers } from './store';

const Provider = getProvider({ store, reducers });

export default Provider;
```

### load#forceUpdate

```javascript
import { load } from 'region-shortcut';

load(key, asyncFunction, { params, forceUpdate, format });

// or
const result = await load(key, Promise, { params, forceUpdate, format });
```

`forceUpdate: true | false`, default as `false`, throttles if the last load call is in the past time that is set. If you don't config expireTime, you may not use forceUpdate.

`forceUpdate: true` calls Promise at once.

### private_setConfig

Use new Region instead of setConfig.

```javascript
private_setConfig({
  reducerPath: 'result', // default as 'region'
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  silentConnect: false, // default as false
});
```

You can set `expiredTime` to enable throttle.

You can set `enableLog` to enable logs when `env !== 'production'`.

You can set `strictLoading` to `false` to enable a different treat of `loading === undefined`, it  will be treated as `undefined` instead of `false` and not computed with others.

You can set `silentConnect` to `true` to enable a default noop Loading Component.

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
