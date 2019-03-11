# Private API

[English](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md) | 中文

### provide

如果你在使用自己的 store，你需要在你 new Region 之前提供 store 和 reducers：

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

`forceUpdate: true | false` 默认为 `false`，在设定的时间内有发起异步就会使用上一次结果。如果你没有设定 expireTime 就不需要这个参数。

`forceUpdate: true` 会立刻调用 asyncFunction。

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
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  DefaultLoading: Loading, // default as undefined
  DefaultError: Error, // default as undefined
});
```

参见 [Region](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#Region)
