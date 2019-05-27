import { region } from './region';

const { private_reducer, private_actionTypes } = region;

const { SET } = private_actionTypes;

const mockDate = () => {
  /* eslint-disable no-global-assign, class-methods-use-this */
  // @ts-ignore
  Date = class {
    getHours() {
      return 0;
    }

    getMinutes() {
      return 0;
    }

    getSeconds() {
      return 0;
    }

    getMilliseconds() {
      return 0;
    }

    getTime() {
      return 0;
    }
  };
  /* eslint-enable no-global-assign, class-methods-use-this */
};

mockDate();

describe('private_reducer', () => {
  test('set string', () => {
    const result = 'a user';
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
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
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        loading: 0,
        result: [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }],
      },
    });
  });

  test('function', () => {
    const result = () => 'should not be string';
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
      user: {
        error: undefined,
        fetchTime: 0,
        loading: 0,
        result,
      },
    });
  });

  test('error', () => {
    const error = new Error('error');
    const state = private_reducer({}, { type: SET, payload: { key: 'user', error } });
    expect(state).toEqual({
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
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    const stateWithError = private_reducer(state, { type: SET, payload: { key: 'user', error } });
    expect(stateWithError).toEqual({
      user: {
        error,
        fetchTime: 0,
        loading: 0,
        result: 'a user',
      },
    });
  });
});
