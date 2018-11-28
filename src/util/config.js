/* eslint-disable import/no-mutable-exports */
// NOTE mutable-exports is need
export let store = null;
export let reducerPath = null;
export let enableLog = true;
export let expiredTime = 5 * 60 * 1000;
export let strictLoading = true;
export let silentConnect = false;
export const setLoading = '@redux-loadings/SET_LOADING';
export const setResult = '@redux-loadings/SET_RESULT';

export const setConfig = (config = {}) => {
  const {
    store: _store,
    reducerPath: _reducerPath,
    expiredTime: _expiredTime,
    enableLog: _enableLog,
    strictLoading: _strictLoading,
    silentConnect: _silentConnect
  } = config;

  if (_store !== undefined) {
    store = _store;
  }
  if (_reducerPath !== undefined) {
    reducerPath = _reducerPath;
  }
  if (_expiredTime !== undefined) {
    expiredTime = _expiredTime;
  }
  if (_enableLog !== undefined) {
    enableLog = _enableLog;
  }
  if (_strictLoading !== undefined) {
    strictLoading = _strictLoading;
  }
  if (_silentConnect !== undefined) {
    silentConnect = _silentConnect;
  }
};
