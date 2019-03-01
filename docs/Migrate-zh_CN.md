# 迁移文档

[English](https://github.com/regionjs/region-core/blob/master/docs/Migrate.md) | 中文

## 0.7.0 升级至 0.7.1

connect 用 hooks 重写了，selector 不再支持。

如果你被影响了，使用 unstable_connect 或者参考[示例](https://github.com/regionjs/region-core/blob/master/example/src/Selector/index.jsx)

## 0.6 升级至 0.7

确保处理所有的警告.

由于支持新的 useProps hook，你需要升级 react@16.8 以及 react-redux@6 （如果你用了 react-redux 的话）。

## 0.6.0 升级至 0.6.x

有一些方法被修改为 private_ 前缀，如果你没有使用，此次改动对你没有影响。

它们是 `private_setState`, `private_reducer`, `private_selectorFactory` (从 `mapResultsToProps` 重命名)。

## 0.5 升级至 0.6

包已经重命名为 'region-core' 和 'region-shortcut'，当然 'redux-loadings' 依旧会持续一段时间。

expireTime 现在默认为 0，你可以移除所有的 forceUpdate 了。

或者如果你需要 expireTime ，你可以用 [Region](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md#Region) 来设置。

<details>
  <summary>
    不再有参考价值
  </summary>

如果你在使用自己的 store，创建一个文件名为 `Provider.js`，然后写：

```javascript
import { getProvider } from 'region-shortcut';
import store, { reducers } from './store';

const Provider = getProvider({ store, reducers });

export default Provider;
```
</details>

## 0.5.0 升级至 0.5.1

set 与 load 重构了，处理某些值如 null 和 promise 时会有细微的差别，且某些不被推荐的情况下 forceUpdate 的处理有有区别。

如果你没有使用推荐之外的用法，此次重构对你没有影响。

## 0.4 升级至 0.5

<details>
  <summary>
    不再有参考价值
  </summary>

确保处理所有的警告.

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
</details>

## 0.3 升级至 0.4

确保处理所有的警告。

在 0.3，如果没有 `load`，`loading` 是 `undefined`。 现在它是 `true`。 你可以通过设置 `strictLoading` 为 `false` 来使用之前的逻辑。

```javascript
setConfig({ store, reducerPath: 'result', strictLoading: false });
```

## 0.2 升级至 0.3

<details>
  <summary>
    只在你使用了 2.0 并使用了 redux-thunk 时，才有参考价值
  </summary>

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
dispatch(load(key, asyncFunction, props));
```

==>

```javascript
load(key, asyncFunction, props);
```

</details>
