import { formatResult, formatResultWithId } from '../formatResult';

describe('formatResult', () => {
  test('throw', () => {
    // @ts-ignore
    expect(() => formatResult()).toThrow();
  });

  test('not throw', () => {
    expect(() => formatResult({ format: undefined, resultOrFunc: undefined, snapshot: undefined })).not.toThrow();
  });

  test('fast', () => {
    const result = 'result';
    expect(formatResult({ format: undefined, snapshot: undefined, resultOrFunc: result })).toBe('result');
  });

  test('format', () => {
    const result = { user: 'user' };
    const format = (res: any) => res.user;
    expect(formatResult({ snapshot: undefined, resultOrFunc: result, format })).toBe('user');
  });

  test('format id', () => {
    const result = { user: 'user' };
    const format = (res: any) => res.user;
    expect(formatResultWithId({ snapshot: undefined, resultOrFunc: result, format, id: 0 })).toEqual({ 0: 'user' });
  });

  test('format fail', () => {
    const result = null;
    const format = (res: any) => res.user;
    expect(() => formatResult({ snapshot: undefined, resultOrFunc: result, format })).toThrow();
  });
});
