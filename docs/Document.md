# Document

English | [中文](https://github.com/regionjs/region/blob/master/docs/Document-zh_CN.md)

### TypeScript 支持

It is highly recommend to use TypeScript to get type inference.

### Know createRegion and createMappedRegion

`region` and `mappedRegion` share same bottom codes. The only difference is that `mappedRegion` stores data in `key-value` forms, while key is not needed in `region` (Or say: the key is internally assigned).

When you need to access value in `mappedRegion`, you need to specify the `key`, which is a very common pattern, such as using a `userId` to get a `User` type value.

Before knowing `mappedRegion`, let's know `region` first, all methods are one-to-one correspondence.

### Create a region

In your application, you will create many `region` to manage data, they are separated from each other and they are global. This means that you can access the same data in different components, and the data does not change with the `mount` and `unmount` of the component. In most cases, you will `set` or `load` value to `region` in `useEffect` or `useCallback`.

- Create a `region` with the following code:

    ```typescript
    import { createRegion } from 'region-react';
    
    const region = createRegion<Value>();
    ```

- You can pass in an `initialValue`:

    ```typescript
    const region = createRegion<Value>(initialValue);
    ```

### Assign value to region

We provide a number of methods to assign, load, get, and subscribe to the data you have in the `region`. These methods include `set`, `load`, `loadBy`, `getXXX` and `useXXX`.

- Use `region.set` to assign value to `region`:

    ```typescript
    const setTrue = () => {
        region.set(true);
    }
    ```

- Similar to the usage of `setState` in `react`, you can pass in a function to change the value on the basis of the existing value:

    ```typescript
    const toggle = () => {
        region.set(value => !value);
    }
    ```

### Manage asynchronous tasks with region

- `region.loadBy` will return an asynchronous function, usually you can name it `loadXXX`, when you call it, `region` will call the given `asyncFunction` and store the value it returns:

    ```typescript
    type FetchUser = () => Promise<User>;
    const fetchUser: FetchUser = async () => {/* do something */};
    
    const loadUser = region.loadBy(fetchUser);
    
    useEffect(
        () => {
            loadUser();
        },
        []
    );
    ```

When `loadFunc` is called, `region` will mark `loading: true`, when it ends, it will mark `loading: false`, you can use `useLoading` to subscribe to it.

You can initiate multiple asynchronous loads at the same time, `region` will use a specific asynchronous `strategy` to handle the conflicts between multiple asynchronous, we will describe the `strategy` in detail later.

Sometimes we need to specify the initial `loading` value of `region`. `region` without any assignment is considered to be `loading: true` by default, but you can control this behavior through the `startLoadingWith` option.

- `loadFunc` does not have to be used with `useEffect`, you can call `loadFunc` in `onCallback`:

    ```typescript jsx
    const Component = () => {
        const handleClick = useCallback(
            () => {
                loadUser();
            },
            []
        )
    
        return <button onClick={handleClick}>load user</button>;
    }
    ```

- It can be used for `prefetch`, such as sending a request before `ReactDOM`'s `render`:

    ```typescript jsx
    const main = () => {
        loadUser();
        root.render(/**/);
    }
    ```

- Usually `asyncFunction` can accept some parameters, in the corresponding `loadFunc`, you can pass these parameters:

    ```typescript
    const fetchUser = async (params: Params): User => {/* do something */};
    const loadUser = region.loadBy(fetchUser);
    loadUser(params);
    ```

- You can use `reducer` to process the returned data before it is stored.

    ```typescript
    const region = createRegion<User[]>([]);
    
    const loadUser = region.loadBy(
        fetchUser,
        (state = [], result, params) => {
            return [...state, result];
        }
    );
    ```

You can also use `region.load` to handle asynchronous tasks, it is very similar to `region.loadBy`, but it accepts a `promise`.

You should notice that when you use `load`, asynchronous task is started before `region` could know, therefore `throttle` and `race` will not work as expected, you may need to handle them by yourself when you encounter related problems.

- Use `region.load` to handle asynchronous tasks:

    ```typescript
    const promise = asyncFunction(params);
    
    region.load(promise);
    ```

### Subscribe to data and status changes with react hooks

- Use `useValue`, `useLoading`, `useError` to subscribe to related changes:

    ```typescript jsx
    const Component = () => {
        const value = region.useValue();
        const loading = region.useLoading();
        const error = region.useError();
    
        // ...
        return <div>{value}</div>
    }
    ```

Where `loading` and `error` are related to asynchronous tasks, `loading` indicates whether the current `region` has an asynchronous task in progress. And `value` and `error` indicate the result of the last asynchronous task, success or failure.

### Use get method to get value directly

- You can use `getValue`, `getLoading`, `getError` to get the value directly, but be careful not to use them in `react` components, but to use them in situations where you are sure you should use them:

    ```typescript
    const handler = () => {
      const value = region.getValue();
      const loading = region.getLoading();
      const error = region.getError();
      // ...
    }
    ```

### Use mappedRegion to manage data in key-value forms

- `mappedRegion` allows you to manage data in `key-value` forms. `key` can be of type `string` or multi-dimensional, such as `{x: 0, y: 0}`:

    ```typescript jsx
    import {createMappedRegion} from 'region-react';
    
    const mappedRegion = createMappedRegion<Key, Value>(initialValue);
    
    const Component = () => {
        const value = mappedRegion.useValue({x: 0, y: 0});
        // ...
    }
    ```

- When you use `mappedRegion`, you need to specify a `key` before calling all methods, such as:

    ```typescript jsx
    mappedRegion.set({x: 0, y: 0}, 1);
    const value = mappedRegion.useValue({x: 0, y: 0}); // 1
    ```

- Also in `loadBy`, you can specify a `key` from `params`:

    ```typescript jsx
    const loadUser = mappedRegion.loadBy(
        params => params.userId,
        fetchUser
    );
    ```

### Synchronize data with localStorage

When creating `region` and `mappedRegion`, you can do some configuration to make `region` have additional features.

When configuring `withLocalStorageKey`, `region` will automatically synchronize with the corresponding item in `localStorage` when storing and accessing values, and you can communicate between multiple tabs through [storage events](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event).

- Configure `withLocalStorageKey`:

    ```typescript
    const userRegion = createRegion(initialUser, {withLocalStorageKey: 'user'});
    ```

### Better asynchronous strategy

You can use `strategy` to configure asynchronous strategy. Currently, four asynchronous strategies are provided:

| Strategy          | Description |
| --- | --- |
| `acceptFirst`     | When multiple asynchronous tasks are sent at the same time, only the first successful result is accepted. If there is already a successful return, the subsequent request will not be sent. |
| `acceptLatest`    | When multiple asynchronous tasks are sent at the same time, only the result of the last task sent is accepted, whether it is successful or failed. |
| `acceptEvery`     | When multiple asynchronous tasks are sent at the same time, all returns are accepted and processed in the order of arrival. Since the order of arrival may be out of order, you need to deal with the problem of out of order. |
| `acceptSequenced` | When multiple asynchronous tasks are sent at the same time, the results are accepted in the order of task sending. When the middle task arrives, the results of the tasks sent before this task are no longer accepted, but the results of the tasks sent later are still accepted. |

The default strategy is `acceptSequenced`, which meets most of the cases. When you need special optimization, you can choose other strategies.

- Configure `strategy`:

    ```typescript
    const userRegion = createRegion(initialUser, {strategy: 'acceptSequenced'});
    ```

### Configure startLoadingWith

- You can configure the initial `loading` value of `region` through `startLoadingWith`, which defaults to `true`.

    ```typescript
    const userRegion = createRegion(initialUser, {startLoadingWith: false});
    ```
