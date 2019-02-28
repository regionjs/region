import { combineReducers } from 'redux';
import { debug, group } from '../util/logger';
import { assignValueDeep, setValueDeep } from '../util/reducerPrototype';
import { getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor(...args) {
      super(...args);
      const store = getStore();
      const { reducers } = store;
      const { name, private_reducer } = this;
      store.reducers = { ...reducers, [name]: private_reducer };
      const reducer = combineReducers(store.reducers);
      store.replaceReducer(reducer);
    }

    private_reducer = (state = {}, action) => {
      const { enableLog, private_actionTypes } = this;
      const { LOAD, SET } = private_actionTypes;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === LOAD) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(LOAD, key);
        }
        return assignValueDeep(state, ['loadings', key], (v = 0) => v + 1);
      }
      if (action.type === SET) {
        const { key, result, error, withLoadEnd } = action.payload;
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        if (result !== undefined) {
          setValueDeep(state, ['results', key], result);
        }
        setValueDeep(state, ['errors', key], error); // as well error ===  undefined
        const nextState = assignValueDeep(state, ['loadings', key], withLoadEnd ? (v = 0) => v - 1 : (v = 0) => v);
        if (enableLogInDev) {
          if (error) {
            console.error(error.message);
          }
          group({ actionType: SET, key, result, error, nextState });
        }
        return nextState;
      }
      return state;
    }
  }
  return Region;
};
