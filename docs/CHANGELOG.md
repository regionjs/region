# CHANGELOG

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
