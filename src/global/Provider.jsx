import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { region } from './region';
import { setStore, store as globalStore } from './store';

// TODO move to region-simple
export const Provider = ({ children }) => <RawProvider store={globalStore}>{children}</RawProvider>;

export const getProvider = ({ store = globalStore, reducers } = {}) => {
  const reducer = combineReducers({ ...reducers, region: region.reducer });
  if (store) {
    store.replaceReducer(reducer);
    setStore(store);
  } else {
    const nextStore = createStore(reducer);
    setStore(nextStore);
  }
  return Provider;
};
