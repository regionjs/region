import { config, setConfig } from '../config';

describe('config', () => {
  test('default', () => {
    expect(config).toEqual({ enableLog: true, expiredTime: 300000, reducerPath: null });
  });
  test('set nothing', () => {
    setConfig();
    expect(config).toEqual({ enableLog: true, expiredTime: 300000, reducerPath: null });
  });
  test('set enableLog as false', () => {
    setConfig({ enableLog: false });
    expect(config).toEqual({ enableLog: false, expiredTime: 300000, reducerPath: null });
  });
  test('set config', () => {
    setConfig({ enableLog: false, expiredTime: 30000, reducerPath: 'results' });
    expect(config).toEqual({ enableLog: false, expiredTime: 30000, reducerPath: 'results' });
  });
});
