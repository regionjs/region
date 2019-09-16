import * as api from '..';

describe('export api', () => {
  test('api contains', () => {
    const {
      // @ts-ignore
      __esModule,
      CombinedRegion,
      Region,
      createRegion,
      createLocalStorageRegion,
      createCombinedRegion,
      createContext,
      useContext,
      ...rest
    } = api;
    expect(__esModule || __esModule === undefined).toBe(true);
    expect(typeof CombinedRegion).toBe('function');
    expect(typeof Region).toBe('function');
    expect(typeof createRegion).toBe('function');
    expect(typeof createLocalStorageRegion).toBe('function');
    expect(typeof createCombinedRegion).toBe('function');
    expect(typeof createContext).toBe('function');
    expect(typeof useContext).toBe('function');
    expect(rest).toEqual({});
  });

  test('createRegion contains many api', () => {
    const { createRegion } = api;
    const {
      set, setBy, load, loadBy,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
    } = createRegion();
    expect(typeof set).toBe('function');
    expect(typeof setBy).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getValue).toBe('function');
    expect(typeof getLoading).toBe('function');
    expect(typeof getError).toBe('function');
    expect(typeof getFetchTime).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof useValue).toBe('function');
    expect(typeof useLoading).toBe('function');
    expect(typeof useError).toBe('function');
    expect(typeof useFetchTime).toBe('function');
  });

  test('CombinedRegion contains many api', () => {
    const { CombinedRegion } = api;
    const {
      reset, set, setBy, load, loadBy, connect, connectWith,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
      name, private_store, enableLog, expiredTime, strictLoading,
      private_actionTypes, private_getState, private_reducer,
      private_getLoadings, private_getResults, private_getFetchTimes, private_getErrors, private_setConfig,
      ...rest
    } = new CombinedRegion('name');
    expect(typeof reset).toBe('function');
    expect(typeof set).toBe('function');
    expect(typeof setBy).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof connectWith).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getValue).toBe('function');
    expect(typeof getLoading).toBe('function');
    expect(typeof getError).toBe('function');
    expect(typeof getFetchTime).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof useValue).toBe('function');
    expect(typeof useLoading).toBe('function');
    expect(typeof useError).toBe('function');
    expect(typeof useFetchTime).toBe('function');
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
    expect(rest).toEqual({});
  });
});
