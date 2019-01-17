# Private API

[English](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md) | 中文

### getProvider

如果你在使用自己的 store，创建一个文件名为 `Provider.js`，然后写：

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

`forceUpdate: true | false` 默认为 `false`，在设定的时间内有发起异步就会使用上一次结果。如果你没有设定 expireTime 就不需要这个参数。

`forceUpdate: true` 会立刻调用 asyncFunction。

### private_setConfig

可以用 new Region 代替。

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

### private_selectorFactory

```javascript
const mapStateToProps = private_selectorFactory('user');
```

参见 [connect & connectWith](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#connect--connectWith)

### getLoading & getResults & getFetchTimes & getError

```javascript
const loading = getLoading(['user', 'follower']);
const user = getResults('user');
const [user, follower] = getResults(['user', 'follower']);
const [userFetchTime, followerFetchTime] = getFetchTimes(['user', 'follower']);
const error = getError(['user', 'follower']);
}
```

`getFetchTimes` 返回 result resolved 时的 `date.getTime()`。
