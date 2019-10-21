import { region } from './region';

describe('private_config', () => {
  test('default', () => {
    const { name, enableLog, expiredTime, strictLoading, private_actionTypes } = region;
    expect(name).toBe('region');
    expect(expiredTime).toBe(0);
    expect(enableLog).toBe(false);
    expect(strictLoading).toBe(true);
    expect(private_actionTypes).toEqual({
      LOAD: '@region/LOAD',
      SET: '@region/SET',
      RESET: '@region/RESET',
    });
  });
});
