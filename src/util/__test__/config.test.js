import { reducerPath, expiredTime, enableLog, setConfig } from '../config';

describe('config', () => {
  test('default', () => {
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
  });
  test('set nothing', () => {
    setConfig();
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(true);
  });
  test('set enableLog as false', () => {
    setConfig({ enableLog: false });
    expect(reducerPath).toBe(null);
    expect(expiredTime).toBe(300000);
    expect(enableLog).toBe(false);
  });
  test('set config', () => {
    setConfig({ enableLog: false, expiredTime: 30000, reducerPath: 'result' });
    expect(reducerPath).toBe('result');
    expect(expiredTime).toBe(30000);
    expect(enableLog).toBe(false);
  });
});
