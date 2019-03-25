import { createStore } from 'redux';
import { setStore } from './store';
import { ProvideOptions } from '../types/interfaces';

export default (options: ProvideOptions = {}) => {
  const { store = createStore(() => {}), reducers = {} } = options;
  store.reducers = reducers;
  setStore(store);
};
