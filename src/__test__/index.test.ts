import * as api from '..';

describe('export api', () => {
  test('api contains', () => {
    const {
      // @ts-ignore
      __esModule,
      createRegion,
      createLocalStorageRegion,
      createCombinedRegion,
      ...rest
    } = api;
    expect(__esModule || __esModule === undefined).toBe(true);
    expect(typeof createRegion).toBe('function');
    expect(typeof createLocalStorageRegion).toBe('function');
    expect(typeof createCombinedRegion).toBe('function');
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
    const { createCombinedRegion } = api;
    const {
      reset, set, setBy, load, loadBy, connect, connectWith,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
      private_store, private_getState,
      private_getLoadings, private_getResults, private_getFetchTimes, private_getErrors,
      ...rest
    } = createCombinedRegion();
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
    expect(typeof private_store).toBe('object');
    expect(typeof private_getState).toBe('function');
    expect(typeof private_getLoadings).toBe('function');
    expect(typeof private_getResults).toBe('function');
    expect(typeof private_getFetchTimes).toBe('function');
    expect(typeof private_getErrors).toBe('function');
    expect(rest).toEqual({});
  });
});
