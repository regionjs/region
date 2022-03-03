# Document

[English](https://github.com/regionjs/region-core/blob/master/docs/Document.md) | 中文

### TypeScript 支持

我们推荐使用 TypeScript，`region-core` 有非常智能的类型推断。

### createRegion

创建一个 region 来管理你的数据。

你可能会创建很多个 region，它们是彼此分离的。

我们提供了多个方法，可以 set, load, get 和 use 你存在 region 中的数据。

```typescript
import { createRegion } from 'region-core';

const region = createRegion<Value>();

// 也可以
const region = createRegion<Value>(initialValue);

const {load, loadBy, set, useValue, useLoading, useError} = region;
```

### region.set

```typescript
region.set(value);
// also
region.set(prevValue => value);
```

### region.loadBy

`region.loadBy` 会返回一个异步函数，调用它时，region 会调用给定 `asyncFunction` 并把它返回的值进行储存。

当 load 开始时，region 会标记 `loading: true`，当它结束时，则会标记为 `loading: false`。

你可以同时发起多个 load，我们已经很好地处理了竞态问题。

一般来说，`asyncFunction` 接受一些参数。

```typescript
const asyncFunction = async (params: Params): Result => {};

// 用 loadBy 包裹异步函数，结果会被存到 region 中
const loadUser = region.loadBy(asyncFunction);

// 调用时，params 会被传给 asyncFunction
loadUser(params);

// 他返回一个 promise，所以你可以 await
await load(asyncFunction);
```

- 你可以使用 `reducer` 处理返回的数据，在它被储存之前。

```javascript
const loadUser = region.loadBy(
    asyncFuncion,
    (state = [], result, params) => {
        state.push(result);
        return state;
    }
);
```

### region.load

`region.load` 和 `region.loadBy` 很像，但它接受一个 promise。

注意，在使用 load 的时候，我们不能为你处理异步问题，所以不推荐使用它。

```typescript
const promise = asuncFunction(params);

region.load(promise);
```

### hooks

包括 `useValue`, `useLoading`, `useError`, `useData`

```typescript jsx
const Component = () => {
    const value = region.useValue();
    const loading = region.useLoading();
    const error = region.useError();

    // ...
    return <div>{value}</div>
}
```

使用 `useData` 时应该提供一个  `Suspense`

```typescript jsx
<Suspense fallback={<div>loading...</div>}>
    <Component />
</Suspense>
```

前往 [examples](https://regionjs.github.io/region-core/#UseValue) 获得更多信息。

### get 方法

包括 `getValue`, `getLoading`, `getError`

```typescript
const handler = () => {
  const value = region.getValue();
  const loading = region.getLoading();
  const error = region.getError();
  // ...
}
```

注意：不要在组件里这样调用，数据发生变化时，组件不会更新。

### createMappedRegion

`mappedRegion` 可以让你以 key-value 的形式管理数据。key 可以是 `string` 类型，也可以是多维度的，比如 `{x: 0, y: 0}`。

```typescript jsx
import {createMappedRegion} from 'region-core';

const mappedRegion = createMappedRegion<Key, Value>(initialValue);

const Component = () => {
    const value = mappedRegion.useValue({x: 0, y: 0});
    // ...
}
```

前往 [examples](https://regionjs.github.io/region-core/#MappedRegion) 获得更多信息。

### createLocalStorageRegion

`localStorageRegion` 会把你存入的数据与 localStorage 中某个特定的 key 同步。

```typescript
import {createLocalStorageRegion} from 'region-core';

const localStorageRegion = createLocalStorageRegion('key', fallbackValue);

const {set, getValue, useValue} = localStorageRegion;
```
