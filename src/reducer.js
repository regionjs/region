import { assignValueDeep, setValueDeep } from './util/reducerPrototype';
import { debug, group } from './util/logger';
import { enableLog, setLoading, setResult, setConfig } from './util/config';

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
  // TODO remove in 0.3
  if (config !== undefined && typeof config !== 'object') {
    console.warn('getReducer params is deprecated');
    config = {}; // eslint-disable-line no-param-reassign
  }
  setConfig(config);
  return (state = {}, action) => {
    if (action.type === setLoading) {
      const { key } = action.payload;
      log(key);
      return assignValueDeep(state, ['loadings', key], true);
    }
    if (action.type === setResult) {
      const { key, result } = action.payload;
      setValueDeep(state, ['results', key], result);
      setValueDeep(state, ['fetchTimes', key], new Date().getTime());
      const nextState = assignValueDeep(state, ['loadings', key], false);
      groupLog(key, result, nextState);
      return nextState;
    }
    return state;
  };
};
