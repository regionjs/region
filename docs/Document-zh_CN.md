# Document

[English](https://github.com/regionjs/region-core/blob/master/docs/Document.md) | 中文

### createRegion

创建一个 region 来管理你的数据。

你可能会创建很多个 region，它们是彼此分离的。

我们提供了多个方法，可以 set, load, get 和 use 你存在 region 中的数据。

```javascript
import { createRegion } from 'region-core';

const region = createRegion();

// 也可以
const region = createRegion(initialValue);

const {load, loadBy, set, useValue, useLoading, useError, useFetchTime, useProps} = region;
```

### region.set

```javascript
region.set(value);
// also
region.set(prevValue => value);
```

### region.load && region.loadBy

`region.load` 会调用 asyncFunction 并把它返回的值进行储存。

当 load 开始时，region 会标记 `loading: true`，当它结束时，则会标记为 `loading: false`。

你可以同时发起多个 load，我们已经很好的处理了竞态问题。

```javascript
region.load(asyncFunction);

// 它返回一个 promise
const result = await load(asyncFunction);

// 可以运行，但不推荐
load(promise);
```

Commonly, asyncFunction is called with params

```javascript
const loadUser = region.loadBy(asyncFuncion);

// 当你这样调用，params 会被传给 asyncFunction
loadUser({userId: 1});
```

你可以使用 `reducer` 处理返回的数据，在它被储存之前。

```javascript
const loadUser = region.loadBy(
  asyncFuncion,
  (state = [], result, params) => {
    result.id = params.userId;
    state.push(result);
    return state;
  }
);

// params 会被透传
loadUser({userId: 1});
```

### hooks

包括 `useValue`, `useLoading`, `useError`, `useFetchTime`, `useProps`

```javascript
const Component = () => {
  const value = region.useValue();
  const loading = region.useLoading();
  const error = region.useError();
  const fetchTime = region.useFetchTime();
  const { loading, error, fetchTime, value } = region.useProps();
  
  return <div>{value}</div>
}
```

前往 [examples](https://regionjs.github.io/region-core/#UseValue) 获得更多信息。

### get 方法

包括 `getValue`, `getLoading`, `getError`, `getFetchTime`, `getProps`

```javascript
const handler = () => {
  const value = region.getValue();
  const loading = region.getLoading();
  const error = region.getError();
  const fetchTime = region.getFetchTime();
  const { loading, error, fetchTime, value } = region.getProps();
  // do something
}
```

不要在组件里这样调用，数据发生变化时，组件不会更新。

### 如何和 class component 一起使用

你可以用一个 function component 的 hoc 包裹你的 class component。

前往 [examples](https://regionjs.github.io/region-core/#ClassComponent) 获得更多信息。

### createCombinedRegion

`CombinedRegion` 会为你组合 `loading`, `error`, `fetchTime` ，同时数据的监听也是共享的。

前往 [examples](https://regionjs.github.io/region-core/#CombinedError) 获得更多信息。
