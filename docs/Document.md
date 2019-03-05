# Document

English | [中文](https://github.com/regionjs/region-core/blob/master/docs/Document-zh_CN.md)

[load](#load)

[set](#set)

[useProps](#useProps)

[connect & connectWith](#connect--connectWith)

[Region](#Region)

[Other Private API](https://github.com/regionjs/region-core/blob/master/docs/PrivateAPI.md)

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
import { set, reset } from 'region-shortcut';

set(key, result, { format });
reset()
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

Some usage in connect also works, but it is not recommend.

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
const Display = ({ loading, error, user }) => {...};
const Enhanced = connectWith('user', Display);
```

`loading === true` if `user.loading === true || follower.loading === true`.

Component Loading receives data as well. You can provide the loading component renders part of the data.

If you want some feature like react-redux ownProps, see [example](https://github.com/regionjs/region-core/blob/master/example/src/Selector/index.jsx)

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
