import * as React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore } from 'redux';
import { setStore } from './store';
import deprecate from '../util/deprecate';
import {ProvideOptions} from '../types'

export const getProvider = (options: ProvideOptions = {}) => {
  deprecate('getProvider is deprecated, use provide instead. region is not using react-redux api anymore.');
  const { store = createStore(() => {}), reducers = {} } = options;
  store.reducers = reducers;
  setStore(store);
  return ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
};
