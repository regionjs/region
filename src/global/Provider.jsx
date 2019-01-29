import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore } from 'redux';
import { setReducerObject, setStore } from './store';

export const getProvider = (options = {}) => {
  const { store = createStore(() => {}), reducers = {} } = options;
  setStore(store);
  setReducerObject(reducers);
  return ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
};
