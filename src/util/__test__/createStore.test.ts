import mockDate from '../../__test__/mockDate';
import { createStore } from '..';

mockDate();

const store = createStore<any>();

describe('createStore', () => {
  test('set string', () => {
    const result = 'a user';
    store.set({ key: 'user', result });
    expect(store.private_getState()).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        loading: 0,
        result: 'a user',
      },
    });
  });

  test('set array', () => {
    const result = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    store.set({ key: 'user', result });
    expect(store.private_getState()).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        loading: 0,
        result: [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }],
      },
    });
  });

  test('function', () => {
    const result = () => 'should be string';
    store.set({ key: 'user', result });
    expect(store.private_getState()).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        loading: 0,
        result: 'should be string',
      },
    });
  });

  test('error', () => {
    const error = new Error('error');
    store.set({ key: 'user', error });
    expect(store.private_getState()).toEqual({
      user: {
        error,
        fetchTime: 0,
        loading: 0,
        result: undefined,
      },
    });
  });

  test('error not cover snapshot', () => {
    const result = 'a user';
    const error = new Error('error');
    store.set({ key: 'user', result });
    // actually region-core will do
    store.set({ key: 'user', result, error });
    expect(store.private_getState()).toEqual({
      user: {
        error,
        fetchTime: 0,
        loading: 0,
        result: 'a user',
      },
    });
  });
});
