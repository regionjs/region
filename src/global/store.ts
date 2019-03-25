let store: any = null;

export const setStore = (nextStore: any) => {
  store = nextStore;
};

export const getStore = () => {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('getProvider must be called before new Region()');
  }
  return store;
};
