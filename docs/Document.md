# Document

[中文版](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

[Provider](#Provider)

[load](#load)

[set](#set)

[connectWith](#connectWith)

[Region](#Region)

[Other Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md)

### Provider

You are recommended not to use redux. Use Provider to surround your App.

```javascript
import { Provider } from 'region-shortcut';
import App from './App';

<Provider><App /></Provider>
```

If you are using your own store, see [`getProvider`](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md#getProvider)

### load

```javascript
import { load } from 'region-shortcut';

load(key, Promise, { params, format });

// or
const result = await load(key, Promise, { params, format });
```

`Promise` is a function returns a promise.

`param` is what `Promise` may need. Promise is called when needed and pass the `param`.

`format` effects after promise resolved and before result is stored, you may do some heavy-calculating task and side effects. It may be something like `(result, snapshot) => result.map(...)`.

`snapshot` is the preview result, it is useful when you try to merge the result of `POST/PUT/DELETE` method.

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
    // NOTE selector runs before loading check, userList may be undefined
    const { id, type } = ownProps;
    const currentUser = userList.find(user => user.id === id && user.type === type);
    return { loading, user: currentUser, follower };
  }
}, Display, Loading);
```

`loading === true` if `user.loading === true || follower.loading === true`.

Component Loading receives data as well. You can provide the loading component renders part of the data.

### Region

You can create several region and they are separated.

```javascript
import { Region } from 'region-shortcut';

const region = new Region({ reducerPath: 'result' });

// or
const region = new Region({
  reducerPath: 'result', // default as 'region'
  expiredTime: 300000, // default as 0
  enableLog: true, // default as true
  strictLoading: true, // default as true
  silentConnect: false, // default as false
});

const { set, load, connectWith } = region;
```

reducerPath is need, [see config details](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md#private_setConfig)

### Other Private API

[Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md)
