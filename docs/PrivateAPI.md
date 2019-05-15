# Private API

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

### connectWith

```javascript
import { connect, connectWith } from 'region-shortcut';

// They are the same
const Enhanced = connect(key, option)(Display);
const Enhanced = connect(key, Display, option);
```

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
  enableLog: true, // default as true
  strictLoading: true, // default as true
  DefaultLoading: Loading, // default as undefined
  DefaultError: Error, // default as undefined
});
```

see [Region](https://github.com/regionjs/region-core/blob/master/docs/Document.md#Region)
