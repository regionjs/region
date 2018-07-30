/* eslint-disable import/no-mutable-exports */
export let reducerPath = null;
export let enableLog = true;
export let expiredTime = 5 * 60 * 1000;

export const setConfig = (configObj = {}) => {
  const { reducerPath: _reducerPath, expiredTime: _expiredTime, enableLog: _enableLog } = configObj;
  if (_reducerPath !== undefined) {
    reducerPath = _reducerPath;
  }
  if (_expiredTime !== undefined) {
    expiredTime = _expiredTime;
  }
  if (_enableLog !== undefined) {
    enableLog = _enableLog;
  }
};
