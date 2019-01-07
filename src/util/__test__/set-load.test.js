import { region } from './region';

const { setConfig, set } = region;

let journey = [];
setConfig({
  store: {
    dispatch: ({ payload }) => journey.push(payload),
    getState: () => {}
  }
});

const getJourney = () => {
  const ans = journey;
  journey = [];
  return ans;
};

describe('set', () => {
  test('string', () => {
    set('user', 'a user');
    expect(getJourney()).toEqual([{
      key: 'user'
    }, {
      key: 'user',
      result: 'a user'
    }]);
  });

  test('array', () => {
    const result = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    set('user', result);
    expect(getJourney()).toEqual([{
      key: 'user'
    }, {
      key: 'user',
      result
    }]);
  });
});
