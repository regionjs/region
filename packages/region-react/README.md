# region-react

`react-react` along with [`region-vanilla`](https://github.com/regionjs/region/blob/master/packages/region-vanilla/README.md) provide a way to manage global context. Supports  React, NextJS, Node, Vanilla. You can use it while using any current solution. (Such as `useState`、`createContext`、`redux`、`recoil`、`mobx`、`jotai`)

English | [中文](https://github.com/regionjs/region/blob/master/docs/README-zh_CN.md)

## Get Started

- install

```bash
npm i region-react
```

- Build your Component above region

```typescript jsx
import {createRegion} from 'region-react';

const region = createRegion<string>('initialValue');

const handleChange = e => region.set(e.target.value);

const Component = () => {
    const value = region.useValue();
    return <input value={value} onChange={handleChange} />;
};
```

- Fetching data with region

```typescript jsx
import {createRegion} from 'region-react';

const region = createRegion<User>();

const loadUser = region.loadBy(asyncFuncion);

// call loadUser in application lifecycle
loadUser({userId: 1});

const Component = () => {
    const value = region.useValue();
    const loading = region.useLoading();
    const error = region.useError();

    // ...
    return <div>{value}</div>;
}
```

## Docs

See [region README](https://github.com/regionjs/region/blob/master/docs/README-zh_CN.md) for more information.
