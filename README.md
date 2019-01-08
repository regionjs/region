# region-core

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

A replacement tool of `redux` to handle sync & async action flow. Extremely simple API!

[中文版](https://github.com/regionjs/region-core/blob/master/docs/README-zh_CN.md)

## Get Started

```bash
npm i region-shortcut
// or
npm i region-core
```

Then create your Component

```jsx harmony
import { connectWith } from 'region-shortcut';
import { fetchUser } from './fetch'; // somewhere with axios

load('user', fetchUser);

const Display = ({ user }) => <div>{user}</div>

export default connectWith('user', Display);
```

or

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

## Docs

[Document And Best Practices](https://github.com/regionjs/region-core/blob/master/docs/Document.md)

[Migrate Guide](https://github.com/regionjs/region-core/blob/master/docs/Migrate.md)

[ChangeLog](https://github.com/regionjs/region-core/blob/master/docs/CHANGELOG.md)

## Example

[Online Example](https://dancerphil.github.io/redux-loadings/index.html)

```bash
git clone https://github.com/regionjs/region-core.git
cd example
npm i
npm start
```

## TODO

- [ ] release 1.0 when everything is ready, push package-lock.json then
- [ ] new site
- [ ] replace badge
