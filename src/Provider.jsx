import React from 'react';
import { Provider as RawProvider } from 'react-redux';
import store from './store';

export const Provider = ({ children }) => <RawProvider store={store}>{children}</RawProvider>;
