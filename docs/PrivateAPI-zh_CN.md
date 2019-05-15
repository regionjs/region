# Private API

[English](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md) | 中文

### connectWith

```javascript
import { connect, connectWith } from 'region-shortcut';

// They are the same
const Enhanced = connect(key, option)(Display);
const Enhanced = connect(key, Display, option);
```

### getLoading & getResults & getFetchTimes & getError & private_selectorFactory

```javascript
const loading = getLoading(['user', 'follower']);
const user = getResults('user');
const [user, follower] = getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = getFetchTimes(['user', 'follower']);
const error = getError(['user', 'follower']);
const { loading, error, user } = private_selectorFactory('user')(store.getState());
}
```

`getFetchTimes` 返回 result resolved 时的 `date.getTime()`。

在大部分情况下都可以使用 [getProps](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#getProps) 代替。

### private_setConfig

可以用 new Region 代替。动态的 private_setConfig 是危险的，确保你知道自己在做什么。

```javascript
private_setConfig({
  name: 'result',
  enableLog: true, // default as true
  strictLoading: true, // default as true
  DefaultLoading: Loading, // default as undefined
  DefaultError: Error, // default as undefined
});
```

参见 [Region](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#Region)
