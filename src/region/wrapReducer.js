import { combineReducers } from 'redux';
import { debug, group } from '../util/logger';
import { assignValueDeep, setValueDeep } from '../util/reducerPrototype';
import { setReducerObject, getReducerObject, getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor(...args) {
      super(...args);
      const reducerObject = getReducerObject();
      const { reducerPath, reducer } = this;
      const nextReducerObject = { ...reducerObject, [reducerPath]: reducer };
      setReducerObject(nextReducerObject);
      const store = getStore();
      const nextReducer = combineReducers(nextReducerObject);
      store.replaceReducer(nextReducer);
    }

    reducer = (state = {}, action) => {
      const { enableLog, SET_LOADING, SET_RESULT } = this;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === SET_LOADING) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(SET_LOADING, key);
        }
        return assignValueDeep(state, ['loadings', key], (v = 0) => v + 1);
      }
      if (action.type === SET_RESULT) {
        const { key, result } = action.payload;
        setValueDeep(state, ['results', key], result);
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        const nextState = assignValueDeep(state, ['loadings', key], (v = 0) => v - 1);
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
