# 迁移文档

## 0.5.0 升级至 0.5.1

set 与 load 重构了，处理某些值如 null 和 promise 时会有细微的差别，且某些不被推荐的情况下 forceUpdate 的处理有有区别。

如果你没有使用推荐之外的用法，此次重构对你没有影响。

## 0.4 升级至 0.5

确保处理所有的警告.

你可以用 `Provider` 代替 `reducer`，因为 store 已经内置了。使用 `set` 可以直接设置一个值。

这一步不是必须的。

```javascript
import { Provider } from 'react-redux';
import store from './store';

<Provider store={store}>
  <App />
</Provider>
```

==>

```javascript
import { Provider } from 'redux-loadings';

<Provider>
  <App />
</Provider>
```

## 0.3 升级至 0.4

确保处理所有的警告。

在 0.3，如果没有 `load`，`loading` 是 `undefined`。 现在它是 `true`。 你可以通过设置 `strictLoading` 为 `false` 来使用之前的逻辑。

```javascript
setConfig({ store, reducerPath: 'result', strictLoading: false });
```

## 0.2 升级至 0.3

确保处理所有的警告。

### 不再需要 redux-thunk

```javascript
import thunk from 'redux-thunk';
const middleware = applyMiddleware(thunk);
```

==>

```javascript
const middleware = applyMiddleware();
```

### 需要传入 store

```javascript
import { reducer as result, setConfig } from 'redux-loadings';

const reducer = combineReducers({ result });
setConfig({ reducerPath: 'result' });
```

==>

```javascript
import { reducer as result, setConfig } from 'redux-loadings';

const reducer = combineReducers({ result });
// ...
const store = compose(middleware)(createStore)(reducer);
setConfig({ store, reducerPath: 'result' });
```

### 不需要用 dispatch 包裹 load

```javascript
dispatch(load(key, Promise, props));
```

==>

```javascript
load(key, Promise, props);
```
