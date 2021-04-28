import mockDate from '../../__test__/mockDate';
import { region } from './region';

mockDate();

describe('createStore', () => {
  test('set string', () => {
    const result = 'a user';
    region.set('user', result);
    expect(region.private_getState_just_for_test()).toEqual({
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
    region.set('user', result);
    expect(region.private_getState_just_for_test()).toEqual({
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
    region.set('user', result);
    expect(region.private_getState_just_for_test()).toEqual({
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
    region.load('user', () => Promise.reject(error));
    new Promise(resolve => setTimeout(resolve, 50)).then(
      () => {
        expect(region.private_getState_just_for_test()).toEqual({
          user: {
            error,
            fetchTime: 0,
            loading: 0,
            result: undefined,
          },
        });
      },
    );
  });

  test('error not cover snapshot', () => {
    const result = 'a user';
    const error = new Error('error');
    region.set('user', result);
    // actually region-core will do
    region.load('user', () => Promise.reject(error));
    new Promise(resolve => setTimeout(resolve, 50)).then(
      () => {
        expect(region.private_getState_just_for_test()).toEqual({
          user: {
            error,
            fetchTime: 0,
            loading: 0,
            result: 'a user',
          },
        });
      },
    );
  });
});
