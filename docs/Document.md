# Document

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

### createRegion

Create a region to manage your data.

You are likely to create many of them, and they are separated.

We provides several method to set, load, get and use the data stored in region.

```javascript
import { createRegion } from 'region-core';

const region = createRegion();

// also
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

`region.load` calls the asyncFunction and store the value it resolved.

When load starts, region will mark it `loading: true`, and when it is settled, it will be marked as `loading: false`.

You can have multiple load at the same time, since it is well race-condition optimized.

Commonly, asyncFunction is called with params

```javascript
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

```javascript
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

```javascript
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

```javascript
const handler = () => {
  const value = region.getValue();
  const loading = region.getLoading();
  const error = region.getError();
  const fetchTime = region.getFetchTime();
  // do something
}
```

Do not use them inside components, the component will not update.

### use region with class component

You can wrap a class component with function component hoc.

Go to [examples](https://regionjs.github.io/region-core/#ClassComponent) for more.

### createMappedRegion

A `MappedRegion` provides a key-value way of managing your data.

Go to [examples](https://regionjs.github.io/region-core/#MappedRegion) for more.
