import { createStore } from 'redux';
import { setStore } from './store';

export default (options = {}) => {
  const { store = createStore(() => {}), reducers = {} } = options;
  store.reducers = reducers;
  setStore(store);
};
