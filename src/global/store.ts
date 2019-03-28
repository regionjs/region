import { createStore, combineReducers, Store } from 'redux';

type Reducer = any;

interface EnhancedStore extends Store {
  reducers: {[key: string]: Reducer};
}

let store: EnhancedStore = createStore(() => {});
store.reducers = {};

export const setStore = (nextStore: EnhancedStore) => {
  store = nextStore;
};

export const getStore = () => store;

export const injectStore = (name: string, private_reducer: Reducer) => {
  const store = getStore();
  const { reducers } = store;
  store.reducers = { ...reducers, [name]: private_reducer };
  const reducer = combineReducers(store.reducers);
  store.replaceReducer(reducer);
};
