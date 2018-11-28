# Document

### Provider

建议不用 redux，直接用 Provider 包裹你的 App。

```javascript
import { Provider } from 'redux-loadings';

<Provider><App /></Provider>
```

### load

```javascript
import { load } from 'redux-loadings';

load(key, Promise, { params, forceUpdate, format });

// or
const result = await load(key, Promise, { params, forceUpdate, format });
```

`Promise` 是一个返回 promise 的函数

`param` 是 `Promise` 需要的参数，当函数发起时会传入 param。

`forceUpdate: true | false` 默认为 `false`，如果5分钟内有发起异步就会使用上一次结果。

`forceUpdate: true` 会立刻调用 Promise。

`format` 在 promise resolved 并在存入 store 之前被调用。你可以在这里做一些计算和副作用。函数的形式可能为 `(result, snapshot) => result.map(...)`.

`snapshot` 是上一次的 result，在你尝试处理 `POST/PUT/DELETE` 方法时会很有用。

### set

```javascript
import { set } from 'redux-loadings';

set(key, result);
```

### connectWith

```javascript
import { connectWith } from 'redux-loadings';

const DisplayComponent = ({ user }) => {...};
const LoadingComponent = ({ user }) => {...}; // or just import one
const EnhancedComponent = connectWith('user', DisplayComponent, LoadingComponent);

// or
const DisplayComponent = ({ user, follower }) => {...};
const EnhancedComponent = connectWith(['user', 'follower'], DisplayComponent, LoadingComponent);

// or
const EnhancedComponent = connectWith({ loading: 'user', result: ['user', 'follower'] }, DisplayComponent, Loading);
```

`loading === true` 当 `user.loading === true || follower.loading === true`。

LoadingComponent 也会得到数据。你可以使用这些数据部分的进行渲染。

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
