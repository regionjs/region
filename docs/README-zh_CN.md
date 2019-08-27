# region-core

[![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core)
[![npm downloads](https://img.shields.io/npm/dm/region-core.svg?style=flat-square)](https://www.npmjs.com/package/region-core)
[![codecov](https://codecov.io/gh/regionjs/region-core/branch/develop/graph/badge.svg)](https://codecov.io/gh/regionjs/region-core)
[![MIT License](https://img.shields.io/npm/l/region-core.svg?style=flat-square)](http://opensource.org/licenses/MIT)

渐进式视图模型管理框架

[English](https://github.com/regionjs/region-core/blob/master/docs/README.md) | 中文

| Package | Version | Docs | Description |
| --- | --- | --- | --- |
| [region-core](https://github.com/regionjs/region-core) | [![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-core/blob/master/docs/Document.md) | Region 的核心，提供 set, load & useProps |
| [region-shortcut](https://github.com/regionjs/region-shortcut) | [![version](https://img.shields.io/npm/v/region-shortcut.svg?style=flat-square)](http://npm.im/region-shortcut) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-shortcut/blob/master/README.md) | region-core 的封装，提供全局的 set, load & useProps |
| [region-form](https://github.com/regionjs/region-form) | [![version](https://img.shields.io/npm/v/region-form.svg?style=flat-square)](http://npm.im/region-form) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-form/blob/master/README.md) | RegionForm，bindWith 可以绑定任何 ant-design 表单组件 |

## Get Started

- 安装

```bash
npm i region-core
```

- 创建一个 region

```jsx harmony
import { Region } from 'region-core';

const region = new Region();
const { set, load, useProps } = region;

export { set, load, useProps };
```

- 创建你的组件

```jsx harmony
import { set, load, useProps } from './region';
import { fetchUser } from './fetch'; // somewhere with axios

load('user', fetchUser);

const Display = () => {
  const { user } = useProps('user');
  return <div>{user}</div>;
}

export default Display;
```

- 或者

```jsx harmony
import { set, load, useProps } from './region';
import { fetchUser, fetchFollower } from './fetch'; // somewhere with axios

load('user', fetchUser);
const handleClick = () => load('follower', fetchFollower);

const Display = () => {
  const { loading, error, user, follower } = useProps(['user', 'follower']);
  return (
    <div>
      {user}
      {follower}
      <Button loading={loading} onClick={handleClick} />
    </div>
  );
}

export default Display;
```

## 文档

[中文文档和最佳实践](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

[迁移指南](https://github.com/regionjs/region-core/blob/master/docs/Migrate-zh_CN.md)

[更新日志](https://github.com/regionjs/region-core/blob/master/docs/CHANGELOG.md)

[征求意见(rfcs)](https://github.com/regionjs/rfcs/issues)

## 示例

[在线示例](https://regionjs.github.io/region-core/)

```bash
git clone https://github.com/regionjs/region-core.git
cd example
npm i
npm start
```
