import { isAsync } from '../isAsync';

describe('isAsync', () => {
  test('promise is async', () => {
    expect(isAsync(Promise.resolve())).toEqual(true);
  });

  test('function returns promise is async', () => {
    expect(isAsync(() => Promise.resolve())).toEqual(true);
  });

  test('function is async', () => {
    expect(isAsync(() => null)).toEqual(true);
  });

  test('object is not async', () => {
    expect(isAsync({})).toEqual(false);
  });

  test('null is not async', () => {
    expect(isAsync(null)).toEqual(false);
  });

  test('string is not async', () => {
    expect(isAsync('')).toEqual(false);
  });
});
