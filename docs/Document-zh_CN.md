# Document

[Provider](#Provider)

[load](#load)

[set](#set)

[connectWith](#connectWith)

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

load(key, Promise, { params, format });

// or
const result = await load(key, Promise, { params, format });
```

`Promise` 是一个返回 promise 的函数

`param` 是 `Promise` 需要的参数，当函数发起时会传入 param。

`format` 在 promise resolved 并在存入 store 之前被调用。你可以在这里做一些计算和副作用。函数的形式可能为 `(result, snapshot) => result.map(...)`.

`snapshot` 是上一次的 result，在你尝试处理 `POST/PUT/DELETE` 方法时会很有用。

### set

```javascript
import { set } from 'region-shortcut';

set(key, result, { format });
```

### connectWith

```javascript
import { connectWith } from 'region-shortcut';

const Display = ({ user }) => {...};
const Loading = ({ user }) => {...}; // or just import one
const Enhanced = connectWith('user', Display, Loading);

// or
const Display = ({ user, follower }) => {...};
const Enhanced = connectWith(['user', 'follower'], Display, Loading);

// or
const Enhanced = connectWith({ loading: 'user', result: ['user', 'follower'] }, Display, Loading);

// or
const Enhanced = connectWith({
  entity: ['userList', 'follower'],
  selector: ({ loading, userList, follower }, ownProps) => {
    // NOTE selector 会在检查 loading 之前就运行，此时 userList 可能为 undefined
    const { id, type } = ownProps;
    const currentUser = userList.find(user => user.id === id && user.type === type);
    return { loading, user: currentUser, follower };
  }
}, Display, Loading);

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
  silentConnect: false, // default as false
});

const { set, load, connectWith } = region;
```

参数详情可以[参考](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md#private_setConfig)

### Other Private API

[Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI-zh_CN.md)
