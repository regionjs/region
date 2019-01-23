# Document

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

[Provider](#Provider)

[load](#load)

[set](#set)

[connect & connectWith](#connect--connectWith)

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

load(key, asyncFunction, { params, format });

// or
const result = await load(key, asyncFunction, { params, format });
```

`asyncFunction` is a function returns a promise.

`param` is what `asyncFunction` may need. asyncFunction is called when needed and pass the `param`.

`format` effects after promise resolved and before result is stored, you may do some heavy-calculating task and side effects. It may be something like `(result, snapshot, error) => result.map(...)`.

It is called after promise is resolved or rejected.

`snapshot` is the preview result, it is useful when you try to merge the result of `POST/PUT/DELETE` method.

### set

```javascript
import { set } from 'region-shortcut';

set(key, result, { format });
```

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
    // NOTE selector runs before loading check, userList may be undefined
    const { id, type } = ownProps;
    const currentUser = userList.find(user => user.id === id && user.type === type);
    return { loading, user: currentUser, follower };
  }
}, Display, { Loading });

// or
const Display = ({ loading, error, user }) => {...};
const Enhanced = connectWith('user', Display);
```

`loading === true` if `user.loading === true || follower.loading === true`.

Component Loading receives data as well. You can provide the loading component renders part of the data.

### Region

You can create several region and they are separated.

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

You can set `expiredTime` to enable throttle.

You can set `enableLog` to enable logs when `env !== 'production'`.

You can set `strictLoading` to `false` to enable a different treat of `loading === undefined`, it  will be treated as `undefined` instead of `false` and not computed with others.

You can set `DefaultLoading` to use a default Loading Component.

You can set `DefaultError` to use a default Error Component.

### Other Private API

[Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md)
