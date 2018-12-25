import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { region } from './region';
import { store as globalStore } from './store';

export const Provider = ({ children }) => <RawProvider store={globalStore}>{children}</RawProvider>;

export const getProvider = ({ store = globalStore, reducers } = {}) => {
  const reducer = combineReducers({ ...reducers, results: region.reducer });
  if (store) {
    store.replaceReducer(reducer);
    region.setConfig({ store, reducerPath: 'results' });
  } else {
    const nextStore = createStore(reducer);
    region.setConfig({ store: nextStore, reducerPath: 'results' });
  }
  return Provider;
};
