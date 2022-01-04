import createMappedRegion, {CreateMappedRegionPureReturnValue} from '../createMappedRegion';
import {
    RegionOption,
    ResultFunc,
    ResultFuncPure,
} from '../types';

interface LoadBy<V, Extend> {
  (
    asyncFunction: () => Promise<V>,
  ): () => Promise<void>;
  <TResult = unknown>(
    asyncFunction: () => Promise<TResult>,
    reducer: (state: V | Extend, result: TResult) => V,
  ): () => Promise<void>;
  <TParams = void>(
      asyncFunction: (params: TParams) => Promise<V>,
  ): (params: TParams) => Promise<void>;
  <TParams = void, TResult = unknown>(
      asyncFunction: (params: TParams) => Promise<TResult>,
      reducer: (state: V | Extend, result: TResult, params: TParams) => V,
  ): (params: TParams) => Promise<void>;
}

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => void;
  reset: () => void;
  load: (promise: Promise<V>) => Promise<void>;
  loadBy: LoadBy<V, undefined>;
  getValue: () => V | undefined;
  getLoading: () => boolean;
  getError: () => Error | undefined;
  getPromise: () => Promise<V> | undefined;
  useValue: {
    (): V | undefined;
    <TResult>(selector: (value: V | undefined) => TResult): TResult;
  };
  useLoading: () => boolean;
  useError: () => Error | undefined;
  useData: {
    (fetcher: () => Promise<void>): V;
    <TResult>(fetcher: () => Promise<void>, selector: (value: V) => TResult): TResult;
  };
}

export interface CreateRegionPureReturnValue<V> extends Omit<CreateRegionReturnValue<V>, 'set' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (resultOrFunc: V | ResultFuncPure<V>) => void;
  loadBy: LoadBy<V, never>;
  getValue: () => V;
  useValue: {
    (): V;
    <TResult>(selector: (value: V) => TResult): TResult;
  };
}

// overload is unsafe in some way, ensure the return type is correct
function createRegion <V>(initialValue: void | undefined, option?: RegionOption): CreateRegionReturnValue<V>;
function createRegion <V>(initialValue: V, option?: RegionOption): CreateRegionPureReturnValue<V>;
function createRegion <V>(initialValue: void | V | undefined, option?: RegionOption): CreateRegionReturnValue<V> | CreateRegionPureReturnValue<V> {
  type Result = CreateRegionReturnValue<V>;

  let region: CreateMappedRegionPureReturnValue<'value', V>;
  if (initialValue !== undefined) {
      region = createMappedRegion<'value', V>(initialValue, option);
  } else {
      region = createMappedRegion<'value', V>(undefined, option) as CreateMappedRegionPureReturnValue<'value', V>;
  }

  const set: Result['set'] = (resultOrFunc: V | ResultFuncPure<V>) => {
      return region.set('value', resultOrFunc);
  };

  const reset: Result['reset'] = () => {
      return region.reset('value');
  };

  const load: Result['load'] = promise => {
      return region.load('value', promise);
  };

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
      asyncFunction: (params: TParams) => Promise<TResult>,
      reducer?: (state: V, result: TResult, params: TParams) => V
  ) => {
      return region.loadBy('value', asyncFunction, reducer as any) as any;
  };

  const getValue: Result['getValue'] = () => {
      return region.getValue('value');
  };

  const getLoading: Result['getLoading'] = () => {
      return region.getLoading('value');
  };

  const getError: Result['getError'] = () => {
      return region.getError('value');
  };

  const getPromise: Result['getPromise'] = () => {
      return region.getPromise('value');
  };

  const useValue: Result['useValue'] = <TResult>(selector?: (value: V) => TResult) => {
      return region.useValue('value', selector as (value: V) => TResult);
  };

  const useLoading: Result['useLoading'] = () => {
      return region.useLoading('value');
  };

  const useError: Result['useError'] = () => {
      return region.useError('value');
  };

  const useData: Result['useData'] = <TResult>(fetcher: () => Promise<void>, selector?: (value: V) => TResult) => {
      return region.useData('value', fetcher, selector as (value: V) => TResult);
  };

  return {
      set,
      reset,
      load,
      loadBy,
      getValue,
      getLoading,
      getError,
      getPromise,
      useValue,
      useLoading,
      useError,
      useData,
  };
}

export default createRegion;
