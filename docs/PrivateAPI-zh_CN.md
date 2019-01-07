# Private API

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

load(key, Promise, { params, forceUpdate, format });

// or
const result = await load(key, Promise, { params, forceUpdate, format });
```

`forceUpdate: true | false` 默认为 `false`，在设定的时间内有发起异步就会使用上一次结果。如果你没有设定 expireTime 就不需要这个参数。

`forceUpdate: true` 会立刻调用 Promise。

### private_setConfig

可以用 new Region 代替。

```javascript
private_setConfig({
  reducerPath: 'result', // default as 'region'
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  silentConnect: false, // default as false
});
```

你可以通过设置 `expiredTime` 以开启节流。

你可以通过设置 `enableLog` 以开启日志，日志在 `env !== 'production'` 下打出。

你可以通过设置 `strictLoading` 为 `false` 以关闭对 `loading === undefined` 的处理（不会视为 false 而是 undefined），并且不影响多个 key 之间的 loading 计算。

你可以通过设置 `silentConnect` 为 `true` 以得使用一个默认的 noop Loading Component。

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

`getFetchTimes` 返回 result resolved 时的 `date.getTime()`。
