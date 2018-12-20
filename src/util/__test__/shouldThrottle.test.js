import { region } from '../region';
import { shouldThrottle } from '../shouldThrottle';

const { setConfig } = region;

const setState = (state) => {
  setConfig({
    store: {
      getState() {
        return state;
      }
    }
  });
};

describe('shouldThrottle', () => {
  test('empty', () => {
    setState(undefined);
    expect(shouldThrottle({})).toEqual(false);
  });
  // TODO test more
});
