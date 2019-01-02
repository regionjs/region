# redux-loadings

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

一个代替 redux 处理同步与异步流程的 react 配套库。极其简单的 API！

## Get Started

```bash
npm i redux-loadings
```

然后创建你的组件

```jsx harmony
import { connectWith } from 'redux-loadings';
import { fetchUser } from './fetch'; // somewhere with axios

load('user', fetchUser);

const Display = ({ user }) => <div>{user}</div>

export default connectWith('user', Display);
```

或者

```jsx harmony
import { connectWith } from 'redux-loadings';
import { fetchUser, fetchFollower } from './fetch'; // somewhere with axios

load('user', fetchUser);
const handleClick = () => load('follower', fetchFollower);

const Display = ({ loading, user, follower }) => (
  <div>
    {user}
    {follower}
    <Button loading={loading} onClick={handleClick} />
  </div>
);

export default connectWith(['user', 'follower'], Display);
```

## 文档

[中文文档](https://github.com/dancerphil/redux-loadings/blob/master/docs/Document-zh_CN.md)

[迁移指南](https://github.com/dancerphil/redux-loadings/blob/master/docs/Migrate-zh_CN.md)

[更新日志](https://github.com/dancerphil/redux-loadings/blob/master/docs/CHANGELOG.md)

## 示例

[在线示例](https://dancerphil.github.io/redux-loadings/index.html)

```bash
git clone https://github.com/dancerphil/redux-loadings.git
cd example
npm i
npm start
```

## 截图

![](https://github.com/dancerphil/redux-loadings/blob/master/screenshot.gif)
