import createMappedRegion, {CreateMappedRegionPureReturnValue} from '../createMappedRegion';
import {
    AsyncFunctionOrPromise,
    Reducer,
    ReducerPure,
    RegionOption,
    ResultFunc,
    ResultFuncPure,
} from '../types';

interface LoadBy<V> {
  <TParams = void>(
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
  ): (params: TParams) => Promise<V | void>;
  <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: Reducer<TParams, TResult, V>,
  ): (params: TParams) => Promise<V | void>;
}

interface LoadByPure<V> {
  <TParams = void>(
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
  ): (params: TParams) => Promise<V>;
  <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: ReducerPure<TParams, TResult, V>,
  ): (params: TParams) => Promise<V>;
}

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => V;
  reset: () => void;
  load: unknown;
  loadBy: LoadBy<V>;
  getValue: () => V | undefined;
  getLoading: () => boolean;
  getError: () => Error | undefined;
  useValue: {
    (): V | undefined;
    <TResult>(selector: (value: V | undefined) => TResult): TResult;
  };
  useLoading: () => boolean;
  useError: () => Error | undefined;
}

export interface CreateRegionPureReturnValue<V> extends Omit<CreateRegionReturnValue<V>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (resultOrFunc: V | ResultFuncPure<V>) => V;
  load: (promise: Promise<V>) => Promise<V>;
  loadBy: LoadByPure<V>;
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

  const load: Result['load'] = <TParams = void, TResult = unknown>(
      asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
      reducer?: Reducer<TParams, TResult, V>
  ) => {
      // @ts-ignore
      return region.load('value', asyncFunction, reducer);
  };

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
      asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
      reducer?: Reducer<TParams, TResult, V>
  ) => {
      return region.loadBy('value', asyncFunction, reducer as Reducer<TParams, TResult, V>);
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

  const useValue: Result['useValue'] = <TResult>(selector?: (value: V) => TResult) => {
      return region.useValue('value', selector as (value: V) => TResult);
  };

  const useLoading: Result['useLoading'] = () => {
      return region.useLoading('value');
  };

  const useError: Result['useError'] = () => {
      return region.useError('value');
  };

  return {
      set,
      reset,
      load,
      loadBy,
      getValue,
      getLoading,
      getError,
      useValue,
      useLoading,
      useError,
  };
}

export default createRegion;
