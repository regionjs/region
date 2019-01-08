import { region } from './region';

const { setConfig } = region;

describe('config', () => {
  test('default', () => {
    const { name, enableLog, expiredTime, strictLoading, silentConnect, SET_LOADING, SET_RESULT } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(SET_LOADING).toBe('@region/SET_LOADING');
    expect(SET_RESULT).toBe('@region/SET_RESULT');
  });
  test('set nothing', () => {
    setConfig();
    const { name, enableLog, expiredTime, strictLoading, silentConnect, SET_LOADING, SET_RESULT } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(SET_LOADING).toBe('@region/SET_LOADING');
    expect(SET_RESULT).toBe('@region/SET_RESULT');
  });
  test('set enableLog as false', () => {
    setConfig({ enableLog: false });
    const { name, enableLog, expiredTime } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(false);
  });
  test('set config', () => {
    setConfig({
      enableLog: false,
      expiredTime: 30000,
      name: 'result',
      strictLoading: false,
      silentConnect: true
    });
    const { name, enableLog, expiredTime, strictLoading, silentConnect, SET_LOADING, SET_RESULT } = region;
    expect(name).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(false);
    expect(silentConnect).toBe(true);
    expect(SET_LOADING).toBe('@result/SET_LOADING');
    expect(SET_RESULT).toBe('@result/SET_RESULT');
  });
  test('deprecated', () => {
    setConfig({
      reducerPath: 'deprecated',
    });
    const { name, SET_LOADING, SET_RESULT } = region;
    expect(name).toBe('deprecated');
    expect(SET_LOADING).toBe('@deprecated/SET_LOADING');
    expect(SET_RESULT).toBe('@deprecated/SET_RESULT');
  });
});
