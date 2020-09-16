import { region } from './region';

const { set, reset, load } = region;

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
    const target = () => 'should be string';
    const result = set('user', target);
    expect(result).toBe('should be string');
  });

  test('reset', () => {
    const result = reset();
    expect(result).toBe(undefined);
  });
});

describe('load', () => {
  test('fallback to set', async () => {
    // @ts-ignore
    const result = await load('user', 'set a user');
    expect(result).toBe('set a user');
  });

  test('promise', async () => {
    // @ts-ignore
    const result = await load('user', Promise.resolve('a user'));
    expect(result).toBe('a user');
  });

  test('asyncFunction', async () => {
    const result = await load('user', () => Promise.resolve('another user'));
    expect(result).toBe('another user');
  });

  test('format', async () => {
    const result = await load('user', () => Promise.resolve('0'), (_: any, user: string) => `${user}1`);
    expect(result).toBe('01');
  });

  test('format snapshot', async () => {
    const result = await load(
      'user',
      () => Promise.resolve('2'),
      (snapshot: any, user: any) => `${snapshot}${user}3`,
    );
    expect(result).toBe('0123');
  });

  test('reject', async () => {
    const result = await load('user', () => Promise.reject(new Error('2')));
    expect(result).toBe('0123');
  });

  test('params can be array', async () => {
    const result = await load('array', (array: any) => Promise.resolve(array.length) , { params: [0, 1] });
    expect(result).toBe(2);
  });
});
