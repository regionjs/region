# CHANGELOG

### 0.7.0

- useProps hooks

- require react@16.8 & react-redux@6, in order to develop useProps hooks

- remove setConfig, silentConnect(in config), reducerPath(in config), entity(in connect)

### 0.6.x

- format: `(result, snapshot) => ...` to `(result, snapshot, error) => ...`

- DefaultLoading, DefaultError, Error

- connect & connectWith({ key }, ...)

- rename mapResultToProps => private_selectorFactory

- fix loading when several load is called, using pendingMutex

- new Region('name') & new Region({ name })

- error support

- deprecate reducerPath, connectWith Loading, entity

### 0.6.0

- rename to region-core and region-shortcut

- Region

- getProvider

### 0.5.x

- selector

- remove connect

- set

- Provider

- setConfig(silentConnect) and remove setConfig(actionType)

- gh-pages

### 0.4.x

- remove willSetResult, didSetResult

- setConfig(strictLoading)

- connectWith(key, Display, Loading)

- deprecate connect

### 0.3.x

- remove asyncLoad, getReducer

- setConfig(store) is needed

- load not surround with dispatch anymore

- getLoading, getResults, getFetchTimes: state is not needed

- connect

- forceUpdate: from ``'never' | 'need' | 'always'` to `true | false`

- deprecate willSetResult, didSetResult

### 0.2.x

- remove setReducerPath

- setConfig(reducerPath, expiredTime, enableLog, actionType)

- getReducer

- willSetResult, didSetResult

- provide snapshot for format, and catch format error

- load with promise

- deprecate asyncLoad, getReducer

### 0.1.x

- load(params, forceUpdate, format)

- asyncLoad

- mapResultToProps

- getLoading, getResults, getFetchTimes

- reducer

- setReducerPath
