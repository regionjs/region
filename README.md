# region-core

[![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core)
[![npm downloads](https://img.shields.io/npm/dm/region-core.svg?style=flat-square)](https://www.npmjs.com/package/region-core)
[![codecov](https://img.shields.io/codecov/c/gh/regionjs/region-core)](https://codecov.io/gh/regionjs/region-core)
[![MIT License](https://img.shields.io/npm/l/region-core.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`react-react` along with `region-vanilla` provide a way to manage global context. Supports  React, NextJS, Node, Vanilla. You can use it while using any current solution. (Such as `useState`、`createContext`、`redux`、`recoil`、`mobx`、`jotai`)

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

[Document And Best Practices](https://github.com/regionjs/region/blob/master/docs/Document.md)

[Migrate Guide](https://github.com/regionjs/region/blob/master/docs/Migrate.md)

[ChangeLog](https://github.com/regionjs/region/blob/master/docs/CHANGELOG.md)

[Request for Comments](https://github.com/regionjs/rfcs/issues)

## Contribute

Feel free to raise issues and PR.
