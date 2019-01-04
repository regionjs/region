import { getStore, setStore } from '../../global/store';

describe('getStore', () => {
  test('throw', () => {
    expect(() => getStore()).toThrow();
  });

  test('getStore', () => {
    const dispatch = () => {};
    const getState = () => {};
    setStore({ dispatch, getState });
    expect(getStore()).toEqual({ dispatch, getState });
  });
});
