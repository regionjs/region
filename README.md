# redux-loadings

[![version](https://img.shields.io/npm/v/redux-loadings.svg?style=flat-square)](http://npm.im/redux-loadings)
[![npm downloads](https://img.shields.io/npm/dm/redux-loadings.svg?style=flat-square)](https://www.npmjs.com/package/redux-loadings)
[![codecov](https://codecov.io/gh/dancerphil/redux-loadings/branch/develop/graph/badge.svg)](https://codecov.io/gh/dancerphil/redux-loadings)
[![MIT License](https://img.shields.io/npm/l/redux-loadings.svg?style=flat-square)](http://opensource.org/licenses/MIT)

A tool to handle network IO with redux.

Get out of `actions`, `middlewares`, `reducers`, `redux-thunk`, `redux-saga`.

Extremely simple API!

## Get Started

```bash
npm i redux-loadings
```

create a file named `load.js`

```javascript
import { load } from 'redux-loadings';
import { fetchUser } from './fetch'; // somewhere with axios

export const loadUser = () => load('user', fetchUser);
```

Then create your Component

```jsx harmony
import { connectWith } from 'redux-loadings';
import { loadUser } from './load';

loadUser();

const DisplayComponent = ({ user }) => {...}

export default connectWith('user', DisplayComponent, Loading);
```

or

```jsx harmony
import { connectWith } from 'redux-loadings';
import { loadUser, loadFollower } from './load';

loadUser();
loadFollower();
// <Button onClick={loadFollower} />

const DisplayComponent = ({ user, follower }) => {...}

export default connectWith(['user', 'follower'], DisplayComponent, Loading);
```

## Docs

[Document](https://github.com/dancerphil/redux-loadings/blob/develop/Document.md)

[Migrate Guide](https://github.com/dancerphil/redux-loadings/blob/develop/Migrate.md)

## Example

```bash
git clone https://github.com/dancerphil/redux-loadings.git
cd example
npm i
npm start
```

## ScreenShots

![](https://github.com/dancerphil/redux-loadings/blob/master/screenshot.gif)

## TODO

- [ ] release es version
- [ ] release 1.0 when everything is ready
