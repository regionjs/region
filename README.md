# region-core

[![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core)
[![npm downloads](https://img.shields.io/npm/dm/region-core.svg?style=flat-square)](https://www.npmjs.com/package/region-core)
[![codecov](https://codecov.io/gh/regionjs/region-core/branch/develop/graph/badge.svg)](https://codecov.io/gh/regionjs/region-core)
[![MIT License](https://img.shields.io/npm/l/region-core.svg?style=flat-square)](http://opensource.org/licenses/MIT)

region-core is a progressive View Model Management Framework. You can use it while using react state, redux, and benefit from it.

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/README-zh_CN.md)

## Get Started

- install

```bash
npm i region-core
```

- Create a Component with region

```jsx harmony
import { createRegion } from 'region-core';

const region = createRegion('initialValue');

const handleChange = e => region.set(e.target.value);

const Component = () => {
  const value = region.useValue();
  return <input value={value} onChange={handleChange} />;
};
```

- Fetching data with region

```jsx harmony
import { createRegion } from 'region-core';

const region = createRegion();

const loadUser = region.loadBy(asyncFuncion);

// call loadUser in application lifecycle
loadUser({userId: 1});

const Component = () => {
  const value = region.useValue();
  const loading = region.useLoading();
  const error = region.useError();

  return <div>{value}</div>;
}
```

## Docs

[Document And Best Practices](https://github.com/regionjs/region-core/blob/master/docs/Document.md)

[Migrate Guide](https://github.com/regionjs/region-core/blob/master/docs/Migrate.md)

[ChangeLog](https://github.com/regionjs/region-core/blob/master/docs/CHANGELOG.md)

[Request for Comments](https://github.com/regionjs/rfcs/issues)

## Example

[Online Example](https://regionjs.github.io/region-core/)

```bash
git clone https://github.com/regionjs/region-core.git
cd example
npm i
npm start
```

[SSR: NextJs with Region](https://codesandbox.io/s/region-ssr-6xprd)

## Contribute

Feel free to raise issues and PR.
