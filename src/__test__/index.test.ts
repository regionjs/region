import * as api from '..';

describe('export api', () => {
  test('api contains Region and provide', () => {
    // @ts-ignore
    const { __esModule, Region, Prop, createContext, useContext, ...rest } = api;
    expect(__esModule || __esModule === undefined).toBe(true);
    expect(typeof Region).toBe('function');
    expect(typeof Prop).toBe('function');
    expect(rest).toEqual({});
  });
  test('region contains many api', () => {
    const { Region } = api;
    const {
      reset, set, setBy, load, loadBy, connect, connectWith, useProps, useValue, getProps, getValue,
      name, private_store, enableLog, expiredTime, strictLoading,
      private_actionTypes, private_getState, private_reducer,
      private_getLoadings, private_getResults, private_getFetchTimes, private_getErrors, private_setConfig,
      // @ts-ignore test that they are not exists
      getLoading, getResults, getFetchTimes, getError, setConfig,
      ...rest
    } = new Region('name');
    expect(typeof reset).toBe('function');
    expect(typeof set).toBe('function');
    expect(typeof setBy).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof connectWith).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof useValue).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getValue).toBe('function');
    expect(typeof name).toBe('string');
    expect(typeof private_store).toBe('object');
    expect(typeof enableLog).toBe('boolean');
    expect(typeof expiredTime).toBe('number');
    expect(typeof strictLoading).toBe('boolean');
    expect(typeof private_actionTypes).toBe('object');
    expect(typeof private_getState).toBe('function');
    expect(typeof private_reducer).toBe('function');
    expect(typeof private_getLoadings).toBe('function');
    expect(typeof private_getResults).toBe('function');
    expect(typeof private_getFetchTimes).toBe('function');
    expect(typeof private_getErrors).toBe('function');
    expect(typeof private_setConfig).toBe('function');
    expect(typeof getLoading).toBe('undefined');
    expect(typeof getResults).toBe('undefined');
    expect(typeof getFetchTimes).toBe('undefined');
    expect(typeof getError).toBe('undefined');
    expect(typeof setConfig).toBe('undefined');
    expect(rest).toEqual({});
  });
});
