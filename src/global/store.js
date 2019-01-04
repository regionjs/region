import { combineReducers } from 'redux';

// eslint-disable-next-line import/no-mutable-exports
let store = null;

export const setStore = (_store) => {
  store = _store;
};

export const getStore = () => {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  return store;
};

let reducerObject = null;

export const setReducerObject = (_reducerObject) => {
  reducerObject = _reducerObject;
};

export const getReducerObject = () => reducerObject;

export const replace = () => {
  const reducer = combineReducers(reducerObject);
  store.replaceReducer(reducer);
  setStore(store);
};
