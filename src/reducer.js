import { assignValueDeep, setValueDeep } from './util/reducerPrototype';
import { debug, group } from './util/logger';
import { setLoading, setResult } from './util/constant';
import { region } from './util/region';

function log(key) {
  const { enableLog } = region;
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    debug(setLoading, key);
  }
}

function groupLog(key, result, nextState) {
  const { enableLog } = region;
  if (process.env.NODE_ENV !== 'production' && enableLog) {
    group(setResult, key, result, nextState);
  }
}

export const reducer = (state = {}, action) => {
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
