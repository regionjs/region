# Private API

### setConfig

这是可选的。

```javascript
setConfig({
  store,
  reducerPath: 'result',
  expiredTime: 300000,
  enableLog: true,
  strictLoading: true
});
```

默认的 `expiredTime` 为 `300,000` 毫秒。如果你不希望节流，可以设为 0。

默认的 `enableLog` 为 `true`，当 `env !== 'production'` 时打印日志。

默认的 `strictLoading` 为 `true`，会把 `loading === undefined` 视为 `true`。如果你把它设为 false， `loading === undefined` 不做处理，并且不影响多个 key 之间的 loading 计算。

当一个数据一开始没有使用，后续调起时又影响 loading。这个设置可能有用。

如果你从 `redux-loadings` 使用了 reducer，你需要传入 store 和 reducerPath。

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

`getFetchTimes` 返回 result resolved 时的 `date.getTime()`。
