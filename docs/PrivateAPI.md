# Private API

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

### provide

If you are using your own store, you should provide your store and reducers before you new Region:

```javascript
import { provide } from 'region-shortcut';

const reducer = combineReducers(reducers); // reducers should be provided, or it will be covered
const store = createStore(...);

provide({ store, reducers });
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

### private_getLoading & private_getResults & private_getFetchTimes & private_getError & private_selectorFactory

```javascript
const loading = private_getLoading(['user', 'follower']);
const user = private_getResults('user');
const [user, follower] = private_getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = private_getFetchTimes(['user', 'follower']);
const error = private_getError(['user', 'follower']);
const { loading, error, user } = private_selectorFactory('user')(store.getState());
}
```

`getFetchTimes` returns `date.getTime()` the moment result is resolved and stored.

Use [getProps](https://github.com/regionjs/region-core/blob/master/docs/Document.md#getProps) instead in nearly all these usages.

### private_setConfig

Use new Region instead of setConfig. private_setConfig dynamically is dangerous, make sure you know what you're doing.

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
