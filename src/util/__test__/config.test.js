import { region } from './region';

const { setConfig } = region;

describe('config', () => {
  test('default', () => {
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@region/LOAD_START',
      LOAD_END: '@region/LOAD_END',
      SET: '@region/SET',
      ERROR: '@region/ERROR',
    });
  });
  test('set nothing', () => {
    setConfig();
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@region/LOAD_START',
      LOAD_END: '@region/LOAD_END',
      SET: '@region/SET',
      ERROR: '@region/ERROR',
    });
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
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(false);
    expect(silentConnect).toBe(true);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@result/LOAD_START',
      LOAD_END: '@result/LOAD_END',
      SET: '@result/SET',
      ERROR: '@result/ERROR',
    });
  });
  test('deprecated', () => {
    setConfig({
      reducerPath: 'deprecated',
    });
    const { name, private_actionTypes } = region;
    expect(name).toBe('deprecated');
    expect(private_actionTypes).toEqual({
      LOAD_START: '@deprecated/LOAD_START',
      LOAD_END: '@deprecated/LOAD_END',
      SET: '@deprecated/SET',
      ERROR: '@deprecated/ERROR',
    });
  });
});
