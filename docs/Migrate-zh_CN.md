# 迁移文档

[English](https://github.com/regionjs/region-core/blob/master/docs/Migrate.md) | 中文

首先，在你迁移之前确保处理所有的警告，然后阅读以下文档。

如果你遇到的问题没有列出，请创建一个 issue。

## 8.0 升级至 8.x

## 0.7 升级至 8.0

`provide` 和 `unstable_connect` 被移除了（包括 `react-redux`）。

`Region` 现在自己维护自己的 store，而不是共享一个 store，所以他们现在不会相互影响。

## 0.7.0 升级至 0.7.x

用 ts 重写了，你可以享受类型推断带来的开发体验了。

`provide` 现在是可选的，只有当你使用 `unstable_connect` 时，你需要调用它。

`connect` 用 hooks 重写了，`selector` 参数不再支持。

如果你被影响了，使用 `unstable_connect` 或者参考[示例](https://github.com/regionjs/region-core/blob/master/example/src/Selector/index.jsx)

`getLoading`, `getResults`, `getFetchTimes`, `getError` 现在是私有的，你可以用 `getProps` 代替。

<details>
  <summary>
    低版本
  </summary>
  
## 0.6 升级至 0.7

由于支持新的 `useProps` hook，你需要升级 `react@16.8` 以及 `react-redux@6` （如果你用了 react-redux 的话）。

## 0.6.0 升级至 0.6.x

有一些方法被修改为 private_ 前缀，如果你没有使用，此次改动对你没有影响。

它们是 `private_setState`, `private_reducer`, `private_selectorFactory` (从 `mapResultsToProps` 重命名)。

## 0.5 升级至 0.6

包已经重命名为 `region-core` 和 `region-shortcut`，当然 `redux-loadings` 依旧会持续一段时间。

expireTime 现在默认为 0，你可以移除所有的 forceUpdate 了。

或者如果你需要 expireTime ，你可以用 [Region](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#Region) 来设置。

如果你在使用自己的 store，创建一个文件名为 `Provider.js`，然后写：

```javascript
import { getProvider } from 'region-shortcut';
import store, { reducers } from './store';

const Provider = getProvider({ store, reducers });

export default Provider;
```

## 0.5.0 升级至 0.5.1

set 与 load 重构了，处理某些值如 null 和 promise 时会有细微的差别，且某些不被推荐的情况下 forceUpdate 的处理有有区别。

如果你没有使用推荐之外的用法，此次重构对你没有影响。

## 0.4 升级至 0.5

你可以用 `Provider` 代替 `reducer`，因为 store 已经内置了。

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

在 0.3，如果没有 `load`，`loading` 是 `undefined`。 现在它是 `true`。 你可以通过设置 `strictLoading` 为 `false` 来使用之前的逻辑。

```javascript
setConfig({ store, reducerPath: 'result', strictLoading: false });
```

## 0.2 升级至 0.3

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
dispatch(load(key, asyncFunction, props));
```

==>

```javascript
load(key, asyncFunction, props);
```

</details>
