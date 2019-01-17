# region-core

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

一个代替 redux 处理同步与异步流程的 react 配套库。极其简单的 API！

[English](https://github.com/regionjs/region-core/blob/master/docs/README.md) | 中文

## Get Started

```bash
npm i region-shortcut
// or
npm i region-core
```

然后创建你的组件

```jsx harmony
import { connectWith } from 'region-shortcut';
import { fetchUser } from './fetch'; // somewhere with axios

load('user', fetchUser);

const Display = ({ user }) => <div>{user}</div>

export default connectWith('user', Display);
```

或者

```jsx harmony
import { connectWith } from 'region-shortcut';
import { fetchUser, fetchFollower } from './fetch'; // somewhere with axios

load('user', fetchUser);
const handleClick = () => load('follower', fetchFollower);

const Display = ({ loading, error, user, follower }) => (
  <div>
    {user}
    {follower}
    <Button loading={loading} onClick={handleClick} />
  </div>
);

export default connectWith(['user', 'follower'], Display);
```

## 文档

[中文文档和最佳实践](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

[迁移指南](https://github.com/regionjs/region-core/blob/master/docs/Migrate-zh_CN.md)

[更新日志](https://github.com/regionjs/region-core/blob/master/docs/CHANGELOG.md)

## 示例

[在线示例](https://dancerphil.github.io/redux-loadings/index.html)

```bash
git clone https://github.com/regionjs/region-core.git
cd example
npm i
npm start
```
