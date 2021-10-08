import createMappedRegion, {CreateMappedRegionPureReturnValue} from '../createMappedRegion';
import {
    Reducer,
    ReducerPure,
    RegionOption,
    ResultFunc,
    ResultFuncPure,
} from '../types';

interface LoadBy<V> {
  (asyncFunction: () => Promise<V>): () => Promise<void>;
  <TParams = void>(
    asyncFunction: (params: TParams) => Promise<V>,
  ): (params: TParams) => Promise<void>;
  <TParams = void, TResult = unknown>(
    asyncFunction: (params: TParams) => Promise<TResult>,
    reducer: Reducer<TParams, TResult, V>,
  ): (params: TParams) => Promise<void>;
}

interface LoadByPure<V> {
  (asyncFunction: () => Promise<V>): () => Promise<void>;
  <TParams = void>(
    asyncFunction: (params: TParams) => Promise<V>,
  ): (params: TParams) => Promise<void>;
  <TParams = void, TResult = unknown>(
    asyncFunction: (params: TParams) => Promise<TResult>,
    reducer: ReducerPure<TParams, TResult, V>,
  ): (params: TParams) => Promise<void>;
}

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => void;
  reset: () => void;
  load: (promise: Promise<V>) => Promise<void>;
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

export interface CreateRegionPureReturnValue<V> extends Omit<CreateRegionReturnValue<V>, 'set' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (resultOrFunc: V | ResultFuncPure<V>) => void;
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

  const load: Result['load'] = promise => {
      return region.load('value', promise);
  };

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
      asyncFunction: (params: TParams) => Promise<TResult>,
      reducer?: Reducer<TParams, TResult, V>
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
