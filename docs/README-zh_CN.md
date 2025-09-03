# region-core

[![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core)
[![npm downloads](https://img.shields.io/npm/dm/region-core.svg?style=flat-square)](https://www.npmjs.com/package/region-core)
[![codecov](https://codecov.io/gh/regionjs/region-core/branch/develop/graph/badge.svg)](https://codecov.io/gh/regionjs/region-core)
[![MIT License](https://img.shields.io/npm/l/region-core.svg?style=flat-square)](http://opensource.org/licenses/MIT)

`react-react` 和 `region-vanilla` 以全局方式管理上下文。支持 React、NextJS、Node、Vanilla 等开发方式。它与现有的所有方案都不冲突（包括 `useState`、`createContext`、`redux`、`recoil`、`mobx`、`jotai`）。

[English](https://github.com/regionjs/region/blob/master/README.md) | 中文

## Get Started

- 安装

```bash
npm i region-react
```

- 在 region 的基础上构造一个组件

```typescript jsx
import {createRegion} from 'region-react';

const region = createRegion<string>('initialValue');

const handleChange = e => region.set(e.target.value);

const Component = () => {
    const value = region.useValue();
    return <input value={value} onChange={handleChange} />;
};
```

- 使用 region 请求数据

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

## 文档

[中文文档和最佳实践](https://github.com/regionjs/region/blob/master/docs/Document-zh_CN.md)

[迁移指南](https://github.com/regionjs/region/blob/master/docs/Migrate-zh_CN.md)

[更新日志](https://github.com/regionjs/region/blob/master/docs/CHANGELOG.md)

[征求意见(rfcs)](https://github.com/regionjs/rfcs/issues)
