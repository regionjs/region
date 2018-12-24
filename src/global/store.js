// eslint-disable-next-line import/no-mutable-exports
let store = null;

export { store };

export const setStore = (_store) => {
  store = _store;
};

export const getStore = () => {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  return store;
};
