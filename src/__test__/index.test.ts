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
      set, load, loadBy,
      getProps, getMap, getId, getValue, getLoading, getError, getFetchTime,
      useProps, useMap, useId, useValue, useLoading, useError, useFetchTime,
    } = createRegion();
    expect(typeof set).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getMap).toBe('function');
    expect(typeof getId).toBe('function');
    expect(typeof getValue).toBe('function');
    expect(typeof getLoading).toBe('function');
    expect(typeof getError).toBe('function');
    expect(typeof getFetchTime).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof useMap).toBe('function');
    expect(typeof useId).toBe('function');
    expect(typeof useValue).toBe('function');
    expect(typeof useLoading).toBe('function');
    expect(typeof useError).toBe('function');
    expect(typeof useFetchTime).toBe('function');
  });

  test('CombinedRegion contains many api', () => {
    const { createCombinedRegion } = api;
    const {
      reset, set, load, loadBy, connect, connectWith,
      getProps, getMap, getId, getValue, getLoading, getError, getFetchTime,
      useProps, useMap, useId, useValue, useLoading, useError, useFetchTime,
      private_store,
      ...rest
    } = createCombinedRegion();
    expect(typeof reset).toBe('function');
    expect(typeof set).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof connectWith).toBe('function');
    expect(typeof getProps).toBe('function');
    expect(typeof getMap).toBe('function');
    expect(typeof getId).toBe('function');
    expect(typeof getValue).toBe('function');
    expect(typeof getLoading).toBe('function');
    expect(typeof getError).toBe('function');
    expect(typeof getFetchTime).toBe('function');
    expect(typeof useProps).toBe('function');
    expect(typeof useMap).toBe('function');
    expect(typeof useId).toBe('function');
    expect(typeof useValue).toBe('function');
    expect(typeof useLoading).toBe('function');
    expect(typeof useError).toBe('function');
    expect(typeof useFetchTime).toBe('function');
    expect(typeof private_store).toBe('object');
    expect(rest).toEqual({});
  });
});
