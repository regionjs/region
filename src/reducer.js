import { handleActions } from 'redux-actions';
import { assignValueDeep, setValueDeep } from './reducerPrototype';
import { debug, group, groupEnd } from './logger';

let enableLog = true;
let setLoading = 'SET_LOADING';
let setResult = 'SET_RESULT'

export const setEnableLog = (value = true) => {
  enableLog = value;
}

function log(key) {
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    debug('redux-loadings', `${setLoading} ${key}`);
  }
}

function groupLog(key, result) {
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    group('redux-loadings', `${setResult} ${key}`);
    console.debug(result);
    groupEnd();
  }
}

export const getReducer = (setLoadingType = 'SET_LOADING', setResultType = 'SET_RESULT') => {
  setLoading = setLoadingType;
  setResult = setResultType;
  return handleActions({
    [setLoading]: (state, action) => {
      const { key } = action.payload;
      log(key);
      return assignValueDeep(state, ['loadings', key], true);
    },
    [setResult]: (state, action) => {
      const { key, result } = action.payload;
      groupLog(key, result);
      setValueDeep(state, ['results', key], result);
      setValueDeep(state, ['fetchTimes', key], new Date().getTime());
      return assignValueDeep(state, ['loadings', key], false);
    },
  }, {});
}

