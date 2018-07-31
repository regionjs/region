/* eslint-disable import/no-mutable-exports */
// NOTE mutable-exports is need
export let reducerPath = null;
export let enableLog = true;
export let expiredTime = 5 * 60 * 1000;
export let setLoading = 'SET_LOADING';
export let setResult = 'SET_RESULT';

export const setConfig = (config = {}) => {
  const {
    reducerPath: _reducerPath,
    expiredTime: _expiredTime,
    enableLog: _enableLog,
    setLoading: _setLoading,
    setResult: _setResult
  } = config;

  if (_reducerPath !== undefined) {
    reducerPath = _reducerPath;
  }
  if (_expiredTime !== undefined) {
    expiredTime = _expiredTime;
  }
  if (_enableLog !== undefined) {
    enableLog = _enableLog;
  }
  if (_setLoading !== undefined) {
    setLoading = _setLoading;
  }
  if (_setResult !== undefined) {
    setResult = _setResult;
  }
};
