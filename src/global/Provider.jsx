import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { setReducerObject, setStore } from './store';
import Region from '../region';

export const getProvider = ({ store = createStore(() => {}), reducers } = {}) => {
  setStore(store);
  const region = new Region('region');
  const reducerObject = { ...reducers, region: region.reducer };
  setReducerObject(reducerObject);
  const reducer = combineReducers(reducerObject);
  store.replaceReducer(reducer);
  return ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
};
