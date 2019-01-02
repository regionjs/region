# redux-loadings

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

A replacement tool of `redux` to handle sync & async action flow. Extremely simple API!

[中文版](https://github.com/dancerphil/redux-loadings/blob/master/docs/README-zh_CN.md)

## Get Started

```bash
npm i redux-loadings
```

Then create your Component

```jsx harmony
import { connectWith } from 'redux-loadings';
import { fetchUser } from './fetch'; // somewhere with axios

load('user', fetchUser);

const Display = ({ user }) => <div>{user}</div>

export default connectWith('user', Display);
```

or

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

## Docs

[Document And Best Practices](https://github.com/dancerphil/redux-loadings/blob/master/docs/Document.md)

[Migrate Guide](https://github.com/dancerphil/redux-loadings/blob/master/docs/Migrate.md)

[ChangeLog](https://github.com/dancerphil/redux-loadings/blob/master/docs/CHANGELOG.md)

## Example

[Online Example](https://dancerphil.github.io/redux-loadings/index.html)

```bash
git clone https://github.com/dancerphil/redux-loadings.git
cd example
npm i
npm start
```

## TODO

- [ ] release 1.0 when everything is ready
- [ ] new site
- [ ] loading => pendingMutex
- [ ] change package name to react-name since redux is not related anymore
