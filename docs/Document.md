# Document

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

### Support TypeScript

TypeScript is recommended.

### createRegion

Create a region to manage your data.

You are likely to create many of them, and they are separated.

We provide several methods to set, load, get and use the data stored in regions.

```typescript
import { createRegion } from 'region-core';

const region = createRegion<Value>();

// also
const region = createRegion<Value>(initialValue);

const {load, loadBy, set, useValue, useLoading, useError, useFetchTime} = region;
```

### region.set

```typescript
region.set(value);
// also
region.set(prevValue => value);
```

### region.load && region.loadBy

`region.loadBy` returns a function, it calls the given asyncFunction and store the value it resolved.

When load starts, region will mark it `loading: true`, and when it is settled, it will be marked as `loading: false`.

You can have multiple load at the same time, since it is well race-condition optimized.

Commonly, asyncFunction is called with params.

```typescript
const loadUser = region.loadBy(asyncFuncion);

// when you call it, params will be passed to asyncFunction
loadUser({userId: 1});

// also
region.load(asyncFunction);

// it returns a promise
const result = await load(asyncFunction);

// this also works, but it is not recommended
load(promise);
```

- You can use a `reducer` to format resolved data before it is stored.

```typescript
const loadUser = region.loadBy(
  asyncFuncion,
  (state = [], result, params) => {
    state.push(result);
    return state;
  }
);

// params will be passed through
loadUser({userId: 1});
```

### hooks

Includes `useValue`, `useLoading`, `useError`, `useFetchTime`

```typescript
const Component = () => {
  const value = region.useValue();
  const loading = region.useLoading();
  const error = region.useError();
  const fetchTime = region.useFetchTime();
  
  return <div>{value}</div>
}
```

Go to [examples](https://regionjs.github.io/region-core/#UseValue) for more.

### get methods

Includes `getValue`, `getLoading`, `getError`, `getFetchTime`

```typescript
const handler = () => {
  const value = region.getValue();
  const loading = region.getLoading();
  const error = region.getError();
  const fetchTime = region.getFetchTime();
  // ...
}
```

Note: Do not use them inside components, the component will not update.

### use region with class component

You can wrap a class component with function component hoc.

Go to [examples](https://regionjs.github.io/region-core/#ClassComponent) for more.

### createMappedRegion

A `MappedRegion` provides a key-value way of managing your data. Key could be string type, or it can be n-dimension such as `{x: 0, y: 0}`.

```typescript
import { createMappedRegion } from 'region-core';

const mappedRegion = createMappedRegion<Key, Value>();

// alse
const MappedRegion = createMappedRegion<Key, Value>(initialValue);

const {load, loadBy, set, useValue, useLoading, useError, useFetchTime} = mappedRegion;
```

when use some state in `mappedRegion`, key should be provided：

```typescript
const Component = () => {
  const value = mappedRegion.useValue({x: 0, y: 0});
  // ...
}
```

`mappedRegion` also supports `getReducedValue` 和 `useReducedValue`, it is a powerful tool, but requires the knowledge of implement detail to use it well.

Go to [examples](https://regionjs.github.io/region-core/#MappedRegion) for more.
