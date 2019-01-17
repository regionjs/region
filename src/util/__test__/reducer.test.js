import { region } from './region';

const { private_reducer, private_actionTypes } = region;

const { SET } = private_actionTypes;

const mockDate = () => {
  /* eslint-disable no-global-assign, class-methods-use-this */
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

describe('reducer', () => {
  test('set string', () => {
    const result = 'a user';
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
      errors: { user: undefined },
      fetchTimes: { user: 0 },
      loadings: { user: 0 },
      results: { user: 'a user' },
    });
  });

  test('set array', () => {
    const result = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
      errors: { user: undefined },
      fetchTimes: { user: 0 },
      loadings: { user: 0 },
      results: { user: [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }] },
    });
  });

  test('function', () => {
    const result = () => 'should not be string';
    const state = private_reducer({}, { type: SET, payload: { key: 'user', result } });
    expect(state).toEqual({
      errors: { user: undefined },
      fetchTimes: { user: 0 },
      loadings: { user: 0 },
      results: { user: result },
    });
  });
});
