import { region } from './region';

const { private_setConfig } = region;

describe('config', () => {
  test('default', () => {
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@region/LOAD',
      SET: '@region/SET',
    });
  });
  test('set nothing', () => {
    private_setConfig();
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(true);
    expect(strictLoading).toBe(true);
    expect(silentConnect).toBe(false);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@region/LOAD',
      SET: '@region/SET',
    });
  });
  test('set enableLog as false', () => {
    private_setConfig({ enableLog: false });
    const { name, enableLog, expiredTime } = region;
    expect(name).toBe(null);
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(false);
  });
  test('set config', () => {
    private_setConfig({
      enableLog: false,
      expiredTime: 30000,
      name: 'result',
      strictLoading: false,
      silentConnect: true,
    });
    const { name, enableLog, expiredTime, strictLoading, silentConnect, private_actionTypes } = region;
    expect(name).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(false);
    expect(silentConnect).toBe(true);
    expect(private_actionTypes).toEqual({
      LOAD_START: '@result/LOAD',
      SET: '@result/SET',
    });
  });
  test('deprecated', () => {
    private_setConfig({
      reducerPath: 'deprecated',
    });
    const { name, private_actionTypes } = region;
    expect(name).toBe('deprecated');
    expect(private_actionTypes).toEqual({
      LOAD_START: '@deprecated/LOAD',
      SET: '@deprecated/SET',
    });
  });
});
