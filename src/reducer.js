import { handleActions } from 'redux-actions';
import { assignValueDeep, setValueDeep } from './util/reducerPrototype';
import { debug, group } from './util/logger';
import { enableLog, setConfig } from './util/config';

const setLoading = 'SET_LOADING';
const setResult = 'SET_RESULT';

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

export const getReducer = (config) => {
  setConfig(config);
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
