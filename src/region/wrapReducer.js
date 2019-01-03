import { debug, group } from '../util/logger';
import { assignValueDeep, setValueDeep } from '../util/reducerPrototype';

export default (RegionIn) => {
  class Region extends RegionIn {
    reducer = (state = {}, action) => {
      const { enableLog, SET_LOADING, SET_RESULT } = this;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === SET_LOADING) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(SET_LOADING, key);
        }
        return assignValueDeep(state, ['loadings', key], true);
      }
      if (action.type === SET_RESULT) {
        const { key, result } = action.payload;
        setValueDeep(state, ['results', key], result);
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        const nextState = assignValueDeep(state, ['loadings', key], false);
        if (enableLogInDev) {
          group(SET_RESULT, key, result, nextState);
        }
        return nextState;
      }
      return state;
    }
  }
  return Region;
};
