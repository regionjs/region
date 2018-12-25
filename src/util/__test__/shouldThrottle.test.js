import { region } from '../../global/region';
import { shouldThrottle } from '../shouldThrottle';

const { setConfig } = region;

const setState = (state) => {
  setConfig({
    store: {
      dispatch() {},
      getState() {
        return state;
      }
    }
  });
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
