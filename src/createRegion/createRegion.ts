import createMappedRegion, { CreateMappedRegionPureReturnValue } from '../createMappedRegion';
import {
  AsyncFunctionOrPromise,
  LoadOption,
  LoadOptionPure,
  OptionOrReducer,
  OptionOrReducerPure,
  RegionOption,
  ResultFunc,
  ResultFuncPure,
} from '../types';

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => V;
  reset: () => void;
  load: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V | void>;
  loadBy: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V | void>;
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
  load: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducerPure<TParams, TResult, V>,
    exOption?: LoadOptionPure<TParams, TResult, V>,
  ) => Promise<V>;
  loadBy: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducerPure<TParams, TResult, V>,
    exOption?: LoadOptionPure<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V>;
  getValue: () => V;
  useValue: () => V;
}

// overload is unsafe in some way, ensure the return type is correct
function createRegion <V>(initialValue: void | undefined, option?: RegionOption): CreateRegionReturnValue<V>;
function createRegion <V>(initialValue: V, option?: RegionOption): CreateRegionPureReturnValue<V>;
function createRegion <V>(initialValue: void | V | undefined, option?: RegionOption): CreateRegionReturnValue<V> | CreateRegionPureReturnValue<V> {
  let region: CreateMappedRegionPureReturnValue<'value', V>;
  if (initialValue !== undefined) {
    region = createMappedRegion<'value', V>(initialValue, option);
  } else {
    region = createMappedRegion<'value', V>(undefined, option) as CreateMappedRegionPureReturnValue<'value', V>;
  }

  const set = (resultOrFunc: V | ResultFuncPure<V>) => {
    return region.set('value', resultOrFunc);
  };

  const reset = region.reset;

  const load = <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    option: OptionOrReducer<TParams, TResult, V> = {},
    exOption?: LoadOption<TParams, TResult, V>,
  ) => {
    return region.load('value', asyncFunction, option, exOption);
  };

  const loadBy = <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    option: OptionOrReducer<TParams, TResult, V> = {},
    exOption?: LoadOption<TParams, TResult, V>,
  ) => {
    return region.loadBy('value', asyncFunction, option, exOption);
  };

  const getValue = () => {
    return region.getValue('value');
  };

  const getLoading = () => {
    return region.getLoading('value');
  };

  const getError = () => {
    return region.getError('value');
  };

  const getFetchTime = () => {
    return region.getFetchTime('value');
  };

  const useValue = () => {
    return region.useValue('value');
  };

  const useLoading = () => {
    return region.useLoading('value');
  };

  const useError = () => {
    return region.useError('value');
  };

  const useFetchTime = () => {
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
