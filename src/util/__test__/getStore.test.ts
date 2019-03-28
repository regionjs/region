import { getStore, setStore } from '../../global/store';

describe('getStore', () => {
  test('init', () => {
    const store = getStore();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
    expect(typeof store.reducers).toBe('object');
  });

  test('getStore', () => {
    const dispatch = () => {};
    const getState = () => {};
    setStore({ dispatch, getState } as any);
    expect(getStore()).toEqual({ dispatch, getState });
  });

  test('reducers', () => {
    const dispatch = () => {};
    const getState = () => {};
    const reducers = { a: 1 };
    setStore({ dispatch, getState, reducers } as any);
    expect(getStore()).toEqual({ dispatch, getState, reducers });
  });
});
