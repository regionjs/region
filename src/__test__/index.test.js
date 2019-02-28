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
      set, load, connect, connectWith, useProps,
      getLoading, getResults, getProps, getFetchTimes, getError,
      private_actionTypes, private_getState, private_reducer, private_selectorFactory, private_setConfig,
      name, enableLog, expiredTime, strictLoading, setConfig,
      ...rest
    } = new Region('name');
    expect(typeof set).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof connectWith).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof getLoading).toBe('function');
    expect(typeof getResults).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getFetchTimes).toBe('function');
    expect(typeof getError).toBe('function');
    expect(typeof private_actionTypes).toBe('object');
    expect(typeof private_getState).toBe('function');
    expect(typeof private_reducer).toBe('function');
    expect(typeof private_selectorFactory).toBe('function');
    expect(typeof private_setConfig).toBe('function');
    expect(typeof name).toBe('string');
    expect(typeof enableLog).toBe('boolean');
    expect(typeof expiredTime).toBe('number');
    expect(typeof strictLoading).toBe('boolean');
    expect(typeof setConfig).toBe('undefined');
    expect(rest).toEqual({});
  });
});
