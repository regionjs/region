import { combineReducers } from 'redux';
import { debug, group } from '../util/logger';
import { assignValueDeep, setValueDeep } from '../util/reducerPrototype';
import { setReducerObject, getReducerObject, getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor(...args) {
      super(...args);
      const reducerObject = getReducerObject();
      const { name, reducer } = this;
      const nextReducerObject = { ...reducerObject, [name]: reducer };
      setReducerObject(nextReducerObject);
      const store = getStore();
      const nextReducer = combineReducers(nextReducerObject);
      store.replaceReducer(nextReducer);
    }

    reducer = (state = {}, action) => {
      const { enableLog, private_actionTypes } = this;
      const { LOAD_START, LOAD_END, SET, ERROR } = private_actionTypes;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === LOAD_START) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(LOAD_START, key);
        }
        return assignValueDeep(state, ['loadings', key], (v = 0) => v + 1);
      }
      if (action.type === LOAD_END) {
        const { key } = action.payload;
        // no log for LOAD_END
        return assignValueDeep(state, ['loadings', key], (v = 0) => v - 1);
      }
      if (action.type === SET) {
        const { key, result } = action.payload;
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        const nextState = assignValueDeep(state, ['results', key], result);
        if (enableLogInDev) {
          group(SET, key, result, nextState);
        }
        return nextState;
      }
      if (action.type === ERROR) {
        const { key, result, error } = action.payload;
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        setValueDeep(state, ['errors', key], error);
        const nextState = assignValueDeep(state, ['results', key], result);
        if (enableLogInDev) {
          group(SET, key, error, nextState);
        }
        return nextState;
      }
      return state;
    }
  }
  return Region;
};
