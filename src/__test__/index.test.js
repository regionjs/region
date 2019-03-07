import * as api from '..';

describe('export api', () => {
  test('api contains Region and getProvider', () => {
    const { Region, getProvider, provide, ...rest } = api;
    expect(typeof Region).toBe('function');
    expect(typeof getProvider).toBe('function');
    expect(typeof provide).toBe('function');
    expect(rest).toEqual({});
  });
  test('region contains many api', () => {
    const { Region, getProvider, provide } = api;
    const Provider = getProvider();
    expect(typeof Provider).toBe('function');
    provide();
    const {
      set, reset, load, connect, unstable_connect, connectWith, useProps, getProps,
      name, enableLog, expiredTime, strictLoading,
      private_actionTypes, private_getState, private_reducer, private_selectorFactory,
      private_getLoading, private_getResults, private_getFetchTimes, private_getError, private_setConfig,
      getLoading, getResults, getFetchTimes, getError, setConfig,
      ...rest
    } = new Region('name');
    expect(typeof set).toBe('function');
    expect(typeof reset).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof unstable_connect).toBe('function');
    expect(typeof connectWith).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof name).toBe('string');
    expect(typeof enableLog).toBe('boolean');
    expect(typeof expiredTime).toBe('number');
    expect(typeof strictLoading).toBe('boolean');
    expect(typeof private_actionTypes).toBe('object');
    expect(typeof private_getState).toBe('function');
    expect(typeof private_reducer).toBe('function');
    expect(typeof private_selectorFactory).toBe('function');
    expect(typeof private_getLoading).toBe('function');
    expect(typeof private_getResults).toBe('function');
    expect(typeof private_getFetchTimes).toBe('function');
    expect(typeof private_getError).toBe('function');
    expect(typeof private_setConfig).toBe('function');
    expect(typeof getLoading).toBe('undefined');
    expect(typeof getResults).toBe('undefined');
    expect(typeof getFetchTimes).toBe('undefined');
    expect(typeof getError).toBe('undefined');
    expect(typeof setConfig).toBe('undefined');
    expect(rest).toEqual({});
  });
});
