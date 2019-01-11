import { setStore } from '../../global/store';
import { shouldThrottle } from '../shouldThrottle';

let state = null;
setStore({
  dispatch() {},
  getState() {
    return state;
  },
});

const setState = (_state) => {
  state = _state;
};

describe('shouldThrottle', () => {
  setState();
  test('empty', () => {
    expect(shouldThrottle({})).toEqual(false);
  });

  test('promise', () => {
    expect(shouldThrottle({ Promise: Promise.resolve() })).toEqual(false);
  });

  test('func', () => {
    expect(shouldThrottle({ Promise: () => null })).toEqual(false);
  });

  test('Promise', () => {
    expect(shouldThrottle({ Promise: () => Promise.resolve() })).toEqual(false);
  });
  // TODO test more
});
