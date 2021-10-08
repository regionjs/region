# CHANGELOG

### 11.x

- add `resetAll`, `reset` now resets value with specific key

- remove unused `getFetchTime` & `useFetchTime`, you could inject it in reducer

### 11.0

- remove `createCombinedRegion`, `getProps`, `useProps`, and `getValue` & `useValue` with array of keys

### 10.x

- deprecate `getProps` & `useProps`

- deprecate `createCombinedRegion`

- deprecate `getValue` & `useValue` with array of keys

### 10.0

- remove `map` and `id` and surrounded apis.

### 9.x

- createMappedRegion

- fix compatible of `load` and `set`

- implement and enable swr by default

### 9.0

- remove all deprecated api

- reimplement and remove `redux`

### 8.x

- add `createRegion` & `createLocalStorageRegion` & `createCombinedRegion`

- add `getValue`, `getLoading`, `getError`, `getFetchTime`, `useValue`, `useLoading`, `useError`, `useFetchTime`

- deprecate `Region` in favor of `createCombinedRegion`

- deprecate several method of `CombinedRegion`

### 8.0

- remove `provide` & `unstable_connect`

- `Region` own its store instead of share it.

### 0.7.x

- migrate to ts and export es5

- `setBy`/`loadBy`

- reset

- `getProps`

- `provide`(optional)

- deprecate `getProvider`

- rename `connect` to `unstable_connect` & deprecate `selector` in new `connect`

- make `getLoading`, `getResults`, `getFetchTimes`, `getError` private

- memoized `useProps`

- `Region` demands `name` to be string

- fix a bug try to build error boundary but failed

### 0.7.0

- `useProps`

- require `react@16.8` & `react-redux@6`, in order to develop `useProps` hook

- remove `setConfig`, `silentConnect`(in config), `reducerPath`(in config), `entity`(in connect)

### 0.6.x

- `format`: `(result, snapshot) => ...` to `(result, snapshot, error) => ...`

- `DefaultLoading`, `DefaultError`, `Error`

- `connect` & `connectWith`({ key }, ...)

- rename `mapResultToProps` => `private_selectorFactory`

- fix `loading` when several load is called, using `pendingMutex`

- `new Region('name')` & `new Region({ name })`

- error support

- deprecate `reducerPath`, `entity`

### 0.6.0

- rename to `region-core` and `region-shortcut`

- `Region`

- `getProvider`

### 0.5.x

- `selector`

- remove `connect`

- `set`

- `Provider`

- `setConfig(silentConnect)` and remove `setConfig(actionType)`

- gh-pages

### 0.4.x

- remove `willSetResult`, `didSetResult`

- `setConfig(strictLoading)`

- `connectWith(key, Display, Loading)`

- deprecate `connect`

### 0.3.x

- remove `asyncLoad`, `getReducer`

- `setConfig(store)` is needed

- `load` not surround with `dispatch` anymore

- `getLoading`, `getResults`, `getFetchTimes`: state is not needed

- `connect`

- `forceUpdate`: from `'never' | 'need' | 'always'` to `true | false`

- deprecate `willSetResult`, `didSetResult`

### 0.2.x

- remove `setReducerPath`

- `setConfig(reducerPath, expiredTime, enableLog, actionType)`

- `getReducer`

- `willSetResult`, `didSetResult`

- provide `snapshot` for `format`, and catch format error

- `load` with promise

- deprecate `asyncLoad`, `getReducer`

### 0.1.x

- `load(params, forceUpdate, format)`

- `asyncLoad`

- `mapResultToProps`

- `getLoading`, `getResults`, `getFetchTimes`

- `reducer`

- `setReducerPath`
