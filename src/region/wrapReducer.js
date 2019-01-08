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
      const { LOAD_START, SET } = private_actionTypes;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === LOAD_START) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(LOAD_START, key);
        }
        return assignValueDeep(state, ['loadings', key], (v = 0) => v + 1);
      }
      if (action.type === SET) {
        const { key, result, error, withLoadEnd } = action.payload;
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        setValueDeep(state, ['results', key], result);
        setValueDeep(state, ['errors', key], error); // as well error ===  undefined
        const nextState = assignValueDeep(state, ['loadings', key], withLoadEnd ? (v = 0) => v - 1 : (v = 0) => v);
        if (enableLogInDev) {
          if (error) {
            console.error(error.message);
          }
          group(SET, key, result, nextState);
        }
        return nextState;
      }
      return state;
    }
  }
  return Region;
};
