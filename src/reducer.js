import { handleActions } from 'redux-actions';
import { assignValueDeep, setValueDeep } from './reducerPrototype';
import { debug, group, groupEnd } from './logger';

const enableSetResult = true;

function log(key) {
  if (enableSetResult) {
    debug('result', `SET_LOADING ${key}`);
  }
}

function groupLog(key, result) {
  if (enableSetResult) {
    group('result', `SET_RESULT ${key}`);
    console.debug(result);
    groupEnd();
  }
}

export const reducer = handleActions({
  SET_LOADING: (state, action) => {
    const { key } = action.payload;
    log(key);
    return assignValueDeep(state, ['loadings', key], true);
  },
  SET_RESULT: (state, action) => {
    const { key, result } = action.payload;
    groupLog(key, result);
    setValueDeep(state, ['results', key], result);
    setValueDeep(state, ['fetchTimes', key], new Date().getTime());
    return assignValueDeep(state, ['loadings', key], false);
  },
}, {});
