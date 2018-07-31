import { reducerPath, expiredTime, enableLog, setLoading, setResult, setConfig } from '../config';

describe('config', () => {
  test('default', () => {
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
    expect(setLoading).toBe('SET_LOADING');
    expect(setResult).toBe('SET_RESULT');
  });
  test('set nothing', () => {
    setConfig();
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
    expect(setLoading).toBe('SET_LOADING');
    expect(setResult).toBe('SET_RESULT');
  });
  test('set enableLog as false', () => {
    setConfig({ enableLog: false });
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(false);
    expect(setLoading).toBe('SET_LOADING');
    expect(setResult).toBe('SET_RESULT');
  });
  test('set config', () => {
    setConfig({
      enableLog: false,
      expiredTime: 30000,
      reducerPath: 'result',
      setLoading: '_SET_LOADING',
      setResult: '_SET_RESULT'
    });
    expect(reducerPath).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(setLoading).toBe('_SET_LOADING');
    expect(setResult).toBe('_SET_RESULT');
  });
});
