# Migrate Guide

[中文版](https://github.com/dancerphil/redux-loadings/blob/master/document/Migrate-zh_CN.md)

## Migrate From 0.5.0 to 0.5.1

set & load is refactored. You may meet some tiny difference.

If your usage is recommend, there should be no effect on you.

## Migrate From 0.4 to 0.5

Ensure no warning.

You may use `Provider` to replace `reducer` as store is inside `redux-loadings`. use `set` to set your key directly.

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

Ensure no warning.

In 0.3, if load is not called, loading returns undefined. Now loading is true. You can set `strictLoading` as false to forward.

You should be more careful about the loading.

```javascript
setConfig({ store, reducerPath: 'result', strictLoading: false });
```

## Migrate From 0.2 to 0.3

Ensure no warning.

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
dispatch(load(key, Promise, props));
```

==>

```javascript
load(key, Promise, props);
```
