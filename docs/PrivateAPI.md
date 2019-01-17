# Private API

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

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
const result = await load(key, asyncFunction, { params, forceUpdate, format });
```

`forceUpdate: true | false`, default as `false`, throttles if the last load call is in the past time that is set. If you don't config expireTime, you may not use forceUpdate.

`forceUpdate: true` calls asyncFunction at once.

### private_setConfig

Use new Region instead of setConfig.

```javascript
private_setConfig({
  name: 'result',
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  DefaultLoading: Loading, // default as undefined
  DefaultError: Error, // default as undefined
});
```

see [Region](https://github.com/regionjs/region-core/blob/master/docs/Document.md#Region)

### private_selectorFactory

```javascript
const mapStateToProps = private_selectorFactory('user');
```

see [connect & connectWith](https://github.com/regionjs/region-core/blob/master/docs/Document.md#connect--connectWith)

### getLoading & getResults & getFetchTimes & getError

```javascript
const loading = getLoading(['user', 'follower']);
const user = getResults('user');
const [user, follower] = getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = getFetchTimes(['user', 'follower']);
const error = getError(['user', 'follower']);
}
```

`getFetchTimes` returns `date.getTime()` the moment result is resolved and stored.
