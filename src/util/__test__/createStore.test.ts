import mockDate from '../../__test__/mockDate';
import { createStore } from '..';

mockDate();

const store = createStore();

describe('createStore', () => {
  test('set string', () => {
    const result = 'a user';
    const state = store.set({ key: 'user', result });
    expect(state).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        id: undefined,
        loading: 0,
        result: 'a user',
        results: {
          undefined: 'a user',
        },
      },
    });
  });

  test('set array', () => {
    const result = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    const state = store.set({ key: 'user', result });
    expect(state).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        id: undefined,
        loading: 0,
        result: [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }],
        results: {
          undefined: [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }],
        },
      },
    });
  });

  test('function', () => {
    const result = () => 'should be string';
    const state = store.set({ key: 'user', result });
    expect(state).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        id: undefined,
        loading: 0,
        result: 'should be string',
        results: {
          undefined: 'should be string',
        },
      },
    });
  });

  test('error', () => {
    const error = new Error('error');
    const state = store.set({ key: 'user', error });
    expect(state).toEqual({
      user: {
        error,
        fetchTime: 0,
        id: undefined,
        loading: 0,
        result: undefined,
        results: {
          // tslint:disable-next-line object-literal-shorthand
          undefined: undefined,
        },
      },
    });
  });

  test('error not cover snapshot', () => {
    const result = 'a user';
    const error = new Error('error');
    store.set({ key: 'user', result });
    // actually region-core will do
    const stateWithError = store.set({ key: 'user', result, error });
    expect(stateWithError).toEqual({
      user: {
        error,
        fetchTime: 0,
        id: undefined,
        loading: 0,
        result: 'a user',
        results: {
          undefined: 'a user',
        },
      },
    });
  });
});
