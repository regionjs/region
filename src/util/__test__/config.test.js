import { reducerPath, enableLog, expiredTime, strictLoading, silentConnect, setLoading, setResult, setConfig } from '../config';

describe('config', () => {
  test('default', () => {
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(setLoading).toBe('@redux-loadings/SET_LOADING');
    expect(setResult).toBe('@redux-loadings/SET_RESULT');
  });
  test('set nothing', () => {
    setConfig();
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(setLoading).toBe('@redux-loadings/SET_LOADING');
    expect(setResult).toBe('@redux-loadings/SET_RESULT');
  });
  test('set enableLog as false', () => {
    setConfig({ enableLog: false });
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(false);
  });
  test('set config', () => {
    setConfig({
      enableLog: false,
      expiredTime: 30000,
      reducerPath: 'result',
      strictLoading: false,
      silentConnect: true
    });
    expect(reducerPath).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(false);
    expect(silentConnect).toBe(true);
  });
});
