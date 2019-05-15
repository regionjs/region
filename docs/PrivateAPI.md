# Private API

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

### connectWith

```javascript
import { connect, connectWith } from 'region-shortcut';

// They are the same
const Enhanced = connect(key, option)(Display);
const Enhanced = connect(key, Display, option);
```

### private_getLoadings & private_getResults & private_getFetchTimes & private_getErrors

```javascript
const [user] = getResults('user');
const [userLoading, followerLoading] = getLoadings(['user', 'follower']);
const [user, follower] = getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = getFetchTimes(['user', 'follower']);
const [userError, followerError] = getErrors(['user', 'follower']);
```

NOTE: they may be changed without notice.

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
