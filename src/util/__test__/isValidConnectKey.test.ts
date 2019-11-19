import { isValidConnectKey } from '../isValidConnectKey';

describe('isValidConnectKey', () => {
  test('string is key', () => {
    expect(isValidConnectKey('')).toEqual(true);
  });

  test('array is key', () => {
    expect(isValidConnectKey([''])).toEqual(true);
    expect(isValidConnectKey(['', ''])).toEqual(true);
  });

  test('object with loading is key', () => {
    expect(isValidConnectKey({ loading: '' })).toEqual(true);
  });

  test('undefined is not key', () => {
    // @ts-ignore
    expect(isValidConnectKey(undefined)).toEqual(false);
  });

  test('null is not key', () => {
    // @ts-ignore
    expect(isValidConnectKey(null)).toEqual(false);
  });

  test('simple object is key', () => {
    expect(isValidConnectKey({})).toEqual(false);
  });
});
