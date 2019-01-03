# Document

[中文版](https://github.com/dancerphil/redux-loadings/blob/master/docs/Document-zh_CN.md)

[Provider](#Provider)

[load](#load)

[set](#set)

[connectWith](#connectWith)

[Region](#Region)

[Other Private API](https://github.com/dancerphil/redux-loadings/blob/master/docs/PrivateAPI.md)

### Provider

You are recommended not to use redux. Use Provider to surround your App.

```javascript
import 'redux-loadings/lib/sideEffect';
import { Provider } from 'redux-loadings';
import App from './App';

<Provider><App /></Provider>
```

If you are using your own store, see [`getProvider`](https://github.com/dancerphil/redux-loadings/blob/master/docs/PrivateAPI.md#getProvider)

### load

```javascript
import { load } from 'redux-loadings';

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
import { set } from 'redux-loadings';

set(key, result, { format });
```

### connectWith

```javascript
import { connectWith } from 'redux-loadings';

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
import { Region } from 'redux-loadings';

// TODO new feature in 0.6.0
const region = new Region(config);

const { set, load, connectWith } = region;
```

### Other Private API

[Private API](https://github.com/dancerphil/redux-loadings/blob/master/docs/PrivateAPI.md)
