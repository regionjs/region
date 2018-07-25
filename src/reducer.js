import { handleActions } from 'redux-actions';
import { assignValueDeep, setValueDeep } from './util/reducerPrototype';
import { debug, group } from './util/logger';

let enableLog = true;
let setLoading = 'SET_LOADING';
let setResult = 'SET_RESULT';

export const setEnableLog = (value = true) => {
  enableLog = value;
};

function log(key) {
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    debug('redux-loadings', `${setLoading} ${key}`);
  }
}

function groupLog(key, result, nextState) {
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    group('redux-loadings', `${setResult} ${key}`, result, nextState);
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
      setValueDeep(state, ['results', key], result);
      setValueDeep(state, ['fetchTimes', key], new Date().getTime());
      const nextState = assignValueDeep(state, ['loadings', key], false);
      groupLog(key, result, nextState);
      return nextState;
    },
  }, {});
};
