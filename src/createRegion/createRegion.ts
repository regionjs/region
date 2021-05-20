import createMappedRegion, { CreateMappedRegionPureReturnValue } from '../createMappedRegion';
import {
  AsyncFunctionOrPromise,
  LoadOption,
  Reducer,
  ReducerPure,
  OptionOrReducer,
  RegionOption,
  ResultFunc,
  ResultFuncPure,
} from '../types';

type LoadBy<V> = {
  <TParams = void>(
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
    reducer?: Reducer<TParams, V, V>,
    exOption?: never,
  ): (params: TParams) => Promise<V | void>;
  <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: Reducer<TParams, TResult, V>,
    exOption?: never,
  ): (params: TParams) => Promise<V | void>;
};

type LoadByPure<V> = {
  <TParams = void>(
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
    reducer?: ReducerPure<TParams, V, V>,
    exOption?: never,
  ): (params: TParams) => Promise<V>;
  <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: ReducerPure<TParams, TResult, V>,
    exOption?: never,
  ): (params: TParams) => Promise<V>;
};

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => V;
  reset: () => void;
  load: unknown;
  loadBy: LoadBy<V>;
  getValue: () => V | undefined;
  getLoading: () => boolean;
  getError: () => Error | undefined;
  getFetchTime: () => number | undefined;
  useValue: () => V | undefined;
  useLoading: () => boolean;
  useError: () => Error | undefined;
  useFetchTime: () => number | undefined;
}

export interface CreateRegionPureReturnValue<V> extends Omit<CreateRegionReturnValue<V>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (resultOrFunc: V | ResultFuncPure<V>) => V;
  load: unknown;
  loadBy: LoadByPure<V>;
  getValue: () => V;
  useValue: () => V;
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
    reducer: Reducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => {
    // @ts-ignore
    return region.load('value', asyncFunction, reducer, exOption);
  };

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer?: Reducer<TParams, TResult, V>,
    exOption?: never,
  ) => {
    return region.loadBy('value', asyncFunction, reducer as Reducer<TParams, TResult, V>, exOption);
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

  const getFetchTime: Result['getFetchTime'] = () => {
    return region.getFetchTime('value');
  };

  const useValue: Result['useValue'] = () => {
    return region.useValue('value');
  };

  const useLoading: Result['useLoading'] = () => {
    return region.useLoading('value');
  };

  const useError: Result['useError'] = () => {
    return region.useError('value');
  };

  const useFetchTime: Result['useFetchTime'] = () => {
    return region.useFetchTime('value');
  };

  return {
    set,
    reset,
    load,
    loadBy,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    useValue,
    useLoading,
    useError,
    useFetchTime,
  };
}

export default createRegion;
