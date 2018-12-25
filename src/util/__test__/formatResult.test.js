import { formatResult } from '../formatResult';

describe('formatResult', () => {
  test('throw', () => {
    expect(() => formatResult()).toThrow();
  });

  test('not throw', () => {
    expect(() => formatResult({})).not.toThrow();
  });

  test('fast', () => {
    const result = 'result';
    expect(formatResult({ result })).toBe('result');
  });

  test('format', () => {
    const result = { user: 'user' };
    const format = (res) => res.user;
    expect(formatResult({ result, format })).toBe('user');
  });

  test('format fail', () => {
    const result = null;
    const format = (res) => res.user;
    let consoleCalled = false;
    console.error = () => { consoleCalled = true; };
    const user = formatResult({ result, format });
    expect(user).toBe(null);
    expect(consoleCalled).toBe(true);
  });
});
