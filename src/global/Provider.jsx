import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { region } from './region';

const reducer = combineReducers({ results: region.reducer });
const store = createStore(reducer);

region.setConfig({ store, reducerPath: 'results' });

export const Provider = ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
