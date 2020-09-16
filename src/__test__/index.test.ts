import * as api from '..';

describe('export api', () => {
  test('api contains', () => {
    const {
      // @ts-ignore
      __esModule,
      createRegion,
      createLocalStorageRegion,
      createCombinedRegion,
      createMappedRegion,
      ...rest
    } = api;
    expect(__esModule || __esModule === undefined).toBe(true);
    expect(typeof createRegion).toBe('function');
    expect(typeof createLocalStorageRegion).toBe('function');
    expect(typeof createCombinedRegion).toBe('function');
    expect(typeof createMappedRegion).toBe('function');
    expect(rest).toEqual({});
  });

  test('createRegion contains many api', () => {
    const { createRegion } = api;
    const {
      set, reset, load, loadBy, connect,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
      ...rest
    } = createRegion();
    expect(typeof set).toBe('function');
    expect(typeof reset).toBe('function');
    expect(typeof load).toBe('function');
    expect(typeof loadBy).toBe('function');
    expect(typeof connect).toBe('function');
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
    expect(rest).toEqual({});
  });

  test('CombinedRegion contains many api', () => {
    const { createCombinedRegion } = api;
    const {
      set, reset, load, loadBy, connect, connectWith,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
      private_setState_just_for_test,
      ...rest
    } = createCombinedRegion();
    expect(typeof set).toBe('function');
    expect(typeof reset).toBe('function');
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
    expect(typeof private_setState_just_for_test).toBe('function');
    expect(rest).toEqual({});
  });

  test('MappedRegion contains many api', () => {
    const { createMappedRegion } = api;
    const {
      set, reset, load, loadBy, connect, connectWith,
      getProps, getValue, getLoading, getError, getFetchTime,
      useProps, useValue, useLoading, useError, useFetchTime,
      private_setState_just_for_test,
      ...rest
    } = createMappedRegion();
    expect(typeof set).toBe('function');
    expect(typeof reset).toBe('function');
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
    expect(typeof private_setState_just_for_test).toBe('function');
    expect(rest).toEqual({});
  });
});
