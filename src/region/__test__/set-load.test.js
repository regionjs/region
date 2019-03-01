import { region } from './region';

const { set, load } = region;

describe('set', () => {
  test('string', () => {
    const result = set('user', 'a user');
    expect(result).toBe('a user');
  });

  test('array', () => {
    const target = [{ id: 1, name: 'zhangcong' }, { id: 2, name: 'milly' }];
    const result = set('user', target);
    expect(result).toBe(target);
  });

  test('function', () => {
    const target = () => 'should not be string';
    const result = set('user', target);
    expect(result).toBe(target);
  });
});


describe('load', () => {
  test('fallback to set', async () => {
    const result = await load('user', 'set a user');
    expect(result).toBe('set a user');
  });

  test('promise', async () => {
    const result = await load('user', Promise.resolve('a user'));
    expect(result).toBe('a user');
  });

  test('asyncFunction', async () => {
    const result = await load('user', () => Promise.resolve('another user'));
    expect(result).toBe('another user');
  });

  test('format', async () => {
    const result = await load('user', () => Promise.resolve('0'), {
      format: user => `${user}1`,
    });
    expect(result).toBe('01');
  });

  test('format snapshot', async () => {
    const result = await load('user', () => Promise.resolve('2'), {
      format: (user, snapshot) => `${snapshot}${user}3`,
    });
    // This is extremely weird
    expect(result).toBe('undefined23');
  });

  test('reject', async () => {
    const result = await load('user', () => Promise.reject(new Error('2')));
    expect(result).toBe(undefined);
  });
});
