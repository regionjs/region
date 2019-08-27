# region-core

[![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core)
[![npm downloads](https://img.shields.io/npm/dm/region-core.svg?style=flat-square)](https://www.npmjs.com/package/region-core)
[![codecov](https://codecov.io/gh/regionjs/region-core/branch/develop/graph/badge.svg)](https://codecov.io/gh/regionjs/region-core)
[![MIT License](https://img.shields.io/npm/l/region-core.svg?style=flat-square)](http://opensource.org/licenses/MIT)

Progressive View Model Management Framework

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/README-zh_CN.md)

| Package | Version | Docs | Description |
| --- | --- | --- | --- |
| [region-core](https://github.com/regionjs/region-core) | [![version](https://img.shields.io/npm/v/region-core.svg?style=flat-square)](http://npm.im/region-core) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-core/blob/master/docs/Document.md) | The core of Region: set, load & useProps |
| [region-shortcut](https://github.com/regionjs/region-shortcut) | [![version](https://img.shields.io/npm/v/region-shortcut.svg?style=flat-square)](http://npm.im/region-shortcut) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-shortcut/blob/master/README.md) | Wrapped core with global set, load & useProps |
| [region-form](https://github.com/regionjs/region-form) | [![version](https://img.shields.io/npm/v/region-form.svg?style=flat-square)](http://npm.im/region-form) | [![](https://img.shields.io/badge/API-markdown-blue.svg?style=flat-square)](https://github.com/regionjs/region-form/blob/master/README.md) | RegionForm extends Region: bindWith any ant-design form item |

## Get Started

- install

```bash
npm i region-core
```

- Create a region

```jsx harmony
import { Region } from 'region-core';

const region = new Region();
const { set, load, useProps } = region;

export { set, load, useProps };
```

- Create your Component

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

- or

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

## Contribute

Region is Extremely easy to extend, fire a issue if you have some great idea.

```javascript
import { Region } from 'region-core';

class MyRegion extends Region {
  constructor(...args) {
    super(...args);
    this.someFunc = this.someFunc.bind(this); // in case you are not using class field
  }

  someFunc() {}
}
```

As for pull request, make sure to add test for your code.
