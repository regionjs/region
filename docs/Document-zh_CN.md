# Document

[English](https://github.com/regionjs/region-core/blob/master/docs/Document.md) | 中文

[Provider](#Provider)

[load](#load)

[set](#set)

[useProps](#useProps)

[connect & connectWith](#connect--connectWith)

[Region](#Region)

[Other Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)

### Provider

建议不用 redux，直接用 Provider 包裹你的 App。

```javascript
import { Provider } from 'region-shortcut';
import App from './App';

<Provider><App /></Provider>
```

如果你在使用自己的 store，参见 [`getProvider`](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md#getProvider)

### load

```javascript
import { load } from 'region-shortcut';

load(key, asyncFunction, { params, format });

// or
const result = await load(key, asyncFunction, { params, format });
```

`asyncFunction` 是一个返回 promise 的函数

`param` 是 `asyncFunction` 需要的参数，当函数发起时会传入 param。

`format` 在 promise resolved 并在存入 store 之前被调用。你可以在这里做一些计算和副作用。函数的形式可能为 `(result, snapshot, error) => result.map(...)`。

它在 promise 被 resolve 或被 reject 时触发。

`snapshot` 是上一次的 result，在你尝试处理 `POST/PUT/DELETE` 方法时会很有用。

### set

```javascript
import { set } from 'region-shortcut';

set(key, result, { format });
```

### useProps

```javascript
import { useProps } from 'region-shortcut';

// in Functional Component
const { user } = useProps('user');

// or
const { loading, error, user } = useProps('user');
const { loading, error, user, follower } = useProps(['user', 'follower']);
```

有一些 connect 的用法在 useProps 中同样可行，但是并不推荐。

### connect & connectWith

```javascript
import { connect, connectWith } from 'region-shortcut';

// these two are equal, in which option is optional
const Enhanced = connect(key, option)(Component);
const Enhanced = connectWith(key, Component, option);

const Display = ({ user }) => {...};
const Loading = ({ user }) => {...}; // or just import one
const Enhanced = connectWith('user', Display, { Loading });

// or
const Display = ({ user, follower }) => {...};
const Enhanced = connectWith(['user', 'follower'], Display, { Loading });

// or
const Enhanced = connectWith({ loading: 'user', result: ['user', 'follower'] }, Display, { Loading });

// or
const Enhanced = connectWith({
  key: ['userList', 'follower'],
  selector: ({ loading, userList, follower }, ownProps) => {
    // NOTE selector 会在检查 loading 之前就运行，此时 userList 可能为 undefined
    const { id, type } = ownProps;
    const currentUser = userList.find(user => user.id === id && user.type === type);
    return { loading, user: currentUser, follower };
  }
}, Display, { Loading });

// or
const Display = ({ loading, error, user }) => {...};
const Enhanced = connectWith('user', Display);
```

`loading === true` 当 `user.loading === true || follower.loading === true`。

Loading 组件也会得到数据。你可以使用这些数据部分的进行渲染。

### Region

你能创建多个 region 并且它们是分离的。

```javascript
import { Region } from 'region-shortcut';

const region = new Region('result');

// or
const region = new Region({
  name: 'result',
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  DefaultLoading: Loading, // default as undefined
  DefaultError: Error, // default as undefined
});

const { set, load, connect, connectWith } = region;
```

你可以通过设置 `expiredTime` 以开启节流。

你可以通过设置 `enableLog` 以开启日志，日志在 `env !== 'production'` 下打出。

你可以通过设置 `strictLoading` 为 `false` 以关闭对 `loading === undefined` 的处理（不会视为 false 而是 undefined），并且不影响多个 key 之间的 loading 计算。

你可以通过设置 `DefaultLoading` 使用一个默认的 Loading Component。

你可以通过设置 `DefaultError` 使用一个默认的 Error Component。

### Other Private API

[Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)
