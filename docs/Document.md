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

const {load, loadBy, set, useValue, useLoading, useError} = region;
```

### region.set

```typescript
region.set(value);
// also
region.set(prevValue => value);
```

### region.loadBy

`region.loadBy` returns a function, it calls the given `asyncFunction` and store the value it resolved.

When load starts, region will mark it `loading: true`. And when it is settled, it will be marked as `loading: false`.

You can have multiple load at the same time, since it is well race-condition optimized.

Commonly, `asyncFunction` is called with params.

```typescript
const asyncFunction = async (params: Params): Result => {};

// wrapped with loadBy, the result will be store in region
const loadUser = region.loadBy(asyncFunction);

// when you call it, params will be passed to asyncFunction
loadUser(params);

// it returns a promise so you can await it
await load(asyncFunction);
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
```

### region.load

`region.load` is similar to `region.loadBy`, but it accepts a promise.

Note that in this case, we can't handle async issues for you. So it is not recommended.

```typescript
const promise = asuncFunction(params);

region.load(promise);
```

### hooks

Includes `useValue`, `useLoading`, `useError`, `useData`

```typescript jsx
const Component = () => {
    const value = region.useValue();
    const loading = region.useLoading();
    const error = region.useError();

    // ...
    return <div>{value}</div>
}
```

When use `useData`, you should provide a `Suspense`

```typescript jsx
<Suspense fallback={<div>loading...</div>}>
    <Component />
</Suspense>
```

Go to [examples](https://regionjs.github.io/region-core/#UseValue) for more.

### get methods

Includes `getValue`, `getLoading`, `getError`

```typescript
const handler = () => {
  const value = region.getValue();
  const loading = region.getLoading();
  const error = region.getError();
  // ...
}
```

Note: Do not use them inside components, the component will not update.

### createMappedRegion

A `mappedRegion` provides a key-value way of managing your data. Key could be `string` type, or it can be n-dimension such as `{x: 0, y: 0}`.

```typescript jsx
import {createMappedRegion} from 'region-core';

const mappedRegion = createMappedRegion<Key, Value>(initialValue);

const Component = () => {
    const value = mappedRegion.useValue({x: 0, y: 0});
    // ...
}
```

Go to [examples](https://regionjs.github.io/region-core/#MappedRegion) for more.

### createLocalStorageRegion

A `localStorageRegion` will sync data with localStorage with a specific key.

```typescript
import {createLocalStorageRegion} from 'region-core';

const localStorageRegion = createLocalStorageRegion('key', fallbackValue);

const {set, getValue, useValue} = localStorageRegion;
```
