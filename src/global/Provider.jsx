import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { region } from './region';
import { setReducerObject, getReducerObject, setStore, getStore, replace } from './store';

// TODO move to region-simple
export const Provider = ({ children }) => <RawProvider store={getStore()}>{children}</RawProvider>;

export const getProvider = ({ store = getStore(), reducers = getReducerObject() } = {}) => {
  const reducerObject = { ...reducers, region: region.reducer };
  setReducerObject(reducerObject);
  if (store) {
    setStore(store);
    replace();
  } else {
    const reducer = combineReducers(reducerObject);
    const nextStore = createStore(reducer);
    setStore(nextStore);
  }
  return Provider;
};
