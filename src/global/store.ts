import { combineReducers } from 'redux';

let store: any = null;

export const setStore = (nextStore: any) => {
  store = nextStore;
};

export const getStore = () => {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('provide must be called before new Region()');
  }
  return store;
};

export const injectStore = (name: string, private_reducer: any) => {
  const store = getStore();
  const { reducers } = store;
  store.reducers = { ...reducers, [name]: private_reducer };
  const reducer = combineReducers(store.reducers);
  store.replaceReducer(reducer);
};
