import { region } from './region';
import { setStore } from '../../global/store';

const { set, load } = region;

let journey = [];
setStore({
  dispatch: ({ payload }) => journey.push(payload),
  getState: () => {},
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
      key: 'user',
      result: 'a user',
    }]);
  });

  test('array', () => {
    const result = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    set('user', result);
    expect(getJourney()).toEqual([{
      key: 'user',
      result,
    }]);
  });

  test('function', () => {
    const result = () => 'should not be string';
    set('user', result);
    expect(getJourney()).toEqual([{
      key: 'user',
      result,
    }]);
  });
});


describe('load', () => {
  test('promise', async () => {
    const result = await load('user', Promise.resolve('a user'));
    expect(result).toBe('a user');
  });

  test('asyncFunction', async () => {
    const result = await load('user', () => Promise.resolve('another user'));
    expect(result).toBe('another user');
  });
});
