# Migrate Guide

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/Migrate-zh_CN.md)

First of all, you should ensure no deprecated warning before migrate. Then read the tips below.

If you meet some problem not listed, please raise an issue.

## Migrate From 8.0 to 8.x

## Migrate Form 0.7 to 8.0

`provide` & `unstable_connect` is removed, also with `react-redux`.

Each `Region` maintains its own store instead of share it. So they will not affect each other.

## Migrate From 0.7.0 to 0.7.x

Rewrite in ts. Enjoy it.

`provide` is optional now, and only when you are using `unstable_connect` should you use it.

`connect` is rewrite with hooks instead of hoc, and `selector` is not supported any more.

If you are affected, use `unstable_connect` or see [example](https://github.com/regionjs/region-core/blob/master/example/src/Selector/index.jsx)

`getLoading`, `getResults`, `getFetchTimes`, `getError` are private now, use `useProps` instead.

<details>
  <summary>
    Lower version
  </summary>

## Migrate From 0.6 to 0.7

update `react@16.8` and `react-redux@6` if you use it, because of the new hook `useProps`.

## Migrate From 0.6.0 to 0.6.x

Some functions are added private_ prefix. If your are not using them, there should be no effect on you.

They are `private_setState`, `private_reducer`, `private_selectorFactory` (from `mapResultsToProps`).

## Migrate From 0.5 to 0.6

package is renamed to `region-core` & `region-shortcut`, `redux-loadings` will be maintained for a while.

expireTime is set to 0, you can remove your forceUpdate.

You can get expireTime back, using [Region](https://github.com/regionjs/region-core/blob/master/docs/Document.md#Region).

If you are using your own store, create a file named `Provider.js`, then write:

```javascript
import { getProvider } from 'region-shortcut';
import store, { reducers } from './store';

const Provider = getProvider({ store, reducers });

export default Provider;
```

## Migrate From 0.5.0 to 0.5.1

set & load is refactored. You may meet some tiny difference.

If your usage is recommend, there should be no effect on you.

## Migrate From 0.4 to 0.5

You may use `Provider` to replace `reducer` as store is inside `redux-loadings`.

It is not a must-do.

```javascript
import { Provider } from 'react-redux';
import store from './store';

<Provider store={store}>
  <App />
</Provider>
```

==>

```javascript
import { Provider } from 'redux-loading';

<Provider>
  <App />
</Provider>
```

## Migrate From 0.3 to 0.4

In 0.3, if load is not called, loading returns undefined. Now loading is true. You can set `strictLoading` as false to forward.

You should be more careful about the loading.

```javascript
setConfig({ store, reducerPath: 'result', strictLoading: false });
```

## Migrate From 0.2 to 0.3

### redux-thunk is not peered anymore

```javascript
import thunk from 'redux-thunk';
const middleware = applyMiddleware(thunk);
```

==>

```javascript
const middleware = applyMiddleware();
```

### store is needed

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

### load not in surround

```javascript
dispatch(load(key, asyncFunction, props));
```

==>

```javascript
load(key, asyncFunction, props);
```
</details>
