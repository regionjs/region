# Document

[English](https://github.com/regionjs/region/blob/master/docs/Document.md) | 中文

### TypeScript 支持

建议你使用 TypeScript 以享受类型推断。

### 了解 createRegion 和 createMappedRegion

`region` 和 `mappedRegion` 拥有相同的底层代码。 唯一的区别是，`mappedRegion` 中的数据是以 `key-value` 的键值对的形式储存的，而 `region` 无需指定键（或者说，被内部确定了隐藏的键）。

当你需要访问 `mappedRegion` 中的值的时候，需要指定 `key`，这是非常常见的模式，比如用一个 `userId` 换取一个 `User` 类型的值。

在了解 `mappedRegion` 前，我们首先了解一下 `region`，他们的所有方法都是一一对应的。

### 创建一个 region

在你的应用中，你会创建很多个 `region` 来管理数据，它们是彼此分离的，并且同为全局。这意味着你可以在不同的组件内访问相同的数据，并且数据不随着组件的 `mount` 和 `unmount` 而发生变化。大部分情况下，你将会在 `useEffect` 或者 `useCallback` 中对 `region` 进行赋值。

- 通过以下代码创建一个 `region`：

    ```typescript
    import { createRegion } from 'region-react';
    
    const region = createRegion<Value>();
    ```

- 可以传入一个 `initialValue`：

    ```typescript
    const region = createRegion<Value>(initialValue);
    ```

### 对 region 赋值

我们提供了多个方法，来赋值、加载、获取、订阅你存在 `region` 中的数据。这些方法包括 `set`, `load`, `loadBy`, `getXXX` 和 `useXXX`。

- 使用 `region.set` 对 `region` 进行直接赋值：

    ```typescript
    const setTrue = () => {
        region.set(true);
    }
    ```

- 类似 `react` 中 `setState` 的用法，你可以传入一个函数，在现有值的基础上更改：

    ```typescript
    const toggle = () => {
        region.set(value => !value);
    }
    ```

### 使用 region 管理异步任务

- `region.loadBy` 会返回一个异步函数，通常你可以将它命名为 `loadXXX`，调用它时，`region` 会调用给定 `asyncFunction` 并把它返回的值进行储存：

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

当 `loadFunc` 被调用时，`region` 会标记 `loading: true`，当它结束时，则会标记 `loading: false`，你可以使用 `useLoading` 来订阅它。

你可以同时发起多个异步加载，`region` 会使用特定的异步策略来处理多个异步之间的冲突，关于策略的部分我们将在后面详述。

有时候我们需要指定 `region` 的初始 `loading` 值，没有任何赋值的 `region` 默认视为 `loading: true`，但是你可以通过 `startLoadingWith` 参数来控制这个行为。

- `loadFunc` 并非一定要与 `useEffect` 配合使用，你可以在 `onCallback` 中调用 `loadFunc`：

    ```typescript jsx
    const Component = () => {
        const handleClick = useCallback(
            () => {
                loadUser();
            },
            []
        )
    
        return <button onClick={handleClick}>加载用户</button>;
    }
    ```

- 可以用于 `prefetch`，比如在 `ReactDOM` 的 `render` 前就发出请求：

    ```typescript jsx
    const main = () => {
        loadUser();
        root.render(/**/);
    }
    ```

- 通常 `asyncFunction` 可以接受一些参数，在对应的 `loadFunc` 中，你可以传入这些参数：

    ```typescript
    const fetchUser = async (params: Params): User => {/* do something */};
    const loadUser = region.loadBy(fetchUser);
    loadUser(params);
    ```

- 你可以使用 `reducer` 处理返回的数据，在它被储存之前。

    ```typescript
    const region = createRegion<User[]>([]);
    
    const loadUser = region.loadBy(
        fetchUser,
        (state = [], result, params) => {
            return [...state, result];
        }
    );
    ```

你还可以使用 `region.load` 来处理异步任务，它和 `region.loadBy` 很像，不过它接受一个 `promise`。

注意，在使用 `load` 的时候，异步任务已经事先开始了，所以一部分节流和竞态的功能会受到影响，在遇到相关的问题的时候，你可能需要自己处理。

- 使用 `region.load` 来处理异步任务：

    ```typescript
    const promise = asyncFunction(params);
    
    region.load(promise);
    ```

### 使用 react hooks 订阅数据和状态的变更

- 使用 `useValue`, `useLoading`, `useError` 订阅相关的变更：

    ```typescript jsx
    const Component = () => {
        const value = region.useValue();
        const loading = region.useLoading();
        const error = region.useError();
    
        // ...
        return <div>{value}</div>
    }
    ```

其中 `loading` 和 `error` 都与异步任务相关，`loading` 指当前 region 是否有异步任务在执行。而 `value` 和 `error` 指当前最后一个异步任务的结果，成功或失败。

### 使用 get 方法直接获取值

- 包括 `getValue`, `getLoading`, `getError`，不过注意不要在 `react` 组件内使用它们，而是在你确定应该使用它们的场合来使用：

    ```typescript
    const handler = () => {
      const value = region.getValue();
      const loading = region.getLoading();
      const error = region.getError();
      // ...
    }
    ```

### 使用 mappedRegion 以 key-value 的形式管理数据

- `mappedRegion` 可以让你以 `key-value` 的形式管理数据。`key` 可以是 `string` 类型，也可以是多维度的，比如 `{x: 0, y: 0}`：

    ```typescript jsx
    import {createMappedRegion} from 'region-react';
    
    const mappedRegion = createMappedRegion<Key, Value>(initialValue);
    
    const Component = () => {
        const value = mappedRegion.useValue({x: 0, y: 0});
        // ...
    }
    ```

- 当你使用 `mappedRegion` 的时候，你需要在调用所有方法之前指定一个 `key`，比如：

    ```typescript jsx
    mappedRegion.set({x: 0, y: 0}, 1);
    const value = mappedRegion.useValue({x: 0, y: 0}); // 1
    ```

- 特别的，在 `loadBy` 中，你可以从 `params` 中指定 `key`：

    ```typescript jsx
    const loadUser = mappedRegion.loadBy(
        params => params.userId,
        fetchUser
    );
    ```

### 使 region 与 localStorage 同步

在创建 `region` 和 `mappedRegion` 的时候，你可以进行一些配置，使 `region` 具备额外的功能。

当配置 `withLocalStorageKey` 后，region 在存取值的时候，会自动的和 `localStorage` 中对应的项进行同步，同时，可以在多个标签页之间通过 [storage 事件](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event) 进行通信。

- 配置 `withLocalStorageKey`：

    ```typescript
    const userRegion = createRegion(initialUser, {withLocalStorageKey: 'user'});
    ```

### 更合适的异步策略

你可以使用 `strategy` 配置异步策略，目前提供了四种异步策略：

| 策略              | 描述 |
| --- | --- |
| `acceptFirst`     | 在多个异步任务同时发出的情况下，只接受第一个成功的结果。如果已经有成功的返回，则后续请求不再发出。 |
| `acceptLatest`    | 在多个异步任务同时发出的情况下，只接受最后一个发出的任务的结果，成功或失败。 |
| `acceptEvery`     | 在多个异步任务同时发出的情况下，接受所有的返回，按照到达的顺序处理。由于到达的顺序可能是乱序，你需要处理乱序导致的问题。 |
| `acceptSequenced` | 在多个异步任务同时发出的情况下，按照任务发出的顺序，接受结果，当中间的任务到达时，则不再接受此任务之前发起的任务的结果，但依旧等待后续发出的结果。 |

默认使用 `acceptSequenced` 的策略，这个策略满足绝大多数情况，在你需要特别的优化的时候，你可以选择其他的策略。

- 配置 `strategy`：

    ```typescript
    const userRegion = createRegion(initialUser, {strategy: 'acceptSequenced'});
    ```

### 配置 startLoadingWith

- 你可以通过 `startLoadingWith` 来配置 `region` 的初始 `loading` 值，这个值默认为 `true`。

  ```typescript
  const userRegion = createRegion(initialUser, {startLoadingWith: false});
  ```
