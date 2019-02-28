import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore } from 'redux';
import { setStore } from './store';

export const getProvider = (options = {}) => {
  console.warn('getProvider is deprecated, use provide instead. region is not using react-redux api anymore');
  const { store = createStore(() => {}), reducers = {} } = options;
  store.reducers = reducers;
  setStore(store);
  return ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
};
