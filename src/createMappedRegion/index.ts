import { useMemo } from 'react';
import { useSubscription } from 'use-subscription';
import * as jsonStableStringify from 'json-stable-stringify';
import { isAsync, createStore } from '../util';
import {
  ResultFunc,
  ResultFuncPure,
  AsyncFunctionOrPromise,
  LoadOption,
  OptionOrReducer,
  AsyncFunction,
  Strategy,
  RegionOption,
} from '../types';

interface ToPromiseParams<TParams, V> {
  asyncFunction: AsyncFunctionOrPromise<TParams, V>;
  params: any;
}

const toPromise = async <TParams, V>({ asyncFunction, params }: ToPromiseParams<TParams, V>) => {
  if (typeof asyncFunction === 'function') {
    return (asyncFunction as AsyncFunction<TParams, V>)(params);
  }
  // promise
  return asyncFunction;
};

const formatLoading = (loading?: number) => {
  // treat undefined as true
  if (loading === undefined) {
    return true;
  }
  return loading > 0;
};

const formatError = (error?: unknown): Error => {
  return typeof error === 'string' ? new Error(error) : (error as Error);
};

const getCombinedOption = <TParams, TResult, V>(
  optionOrReducer: OptionOrReducer<TParams, TResult, V> = {},
  exOption?: LoadOption<TParams, TResult, V>,
): LoadOption<TParams, TResult, V> => {
  if (typeof optionOrReducer === 'function') {
    if (exOption) {
      return { reducer: optionOrReducer, ...exOption };
    }
    return { reducer: optionOrReducer };
  }
  return optionOrReducer;
};

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
  if (typeof resultOrFunc === 'function') {
    return (resultOrFunc as ResultFuncPure<V>)(snapshot);
  }
  return resultOrFunc;
};

export interface CreateMappedRegionReturnValue<K, V> {
  private_getState_just_for_test: () => any;
  private_setState_just_for_test: (value: any) => void;
  set: (key: K, resultOrFunc: V | ResultFunc<V>) => V;
  reset: () => void;
  load: <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V | void>;
  loadBy: <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V | void>;
  getValue: (key: K) => V | undefined;
  getLoading: (key: K) => boolean;
  getError: (key: K) => Error | undefined;
  getFetchTime: (key: K) => number | undefined;
  useValue: (key: K) => V | undefined;
  useLoading: (key: K) => boolean;
  useError: (key: K) => Error | undefined;
  useFetchTime: (key: K) => number | undefined;
}

export interface CreateMappedRegionPureReturnValue<K, V>
  extends Omit<CreateMappedRegionReturnValue<K, V>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (key: K, resultOrFunc: V | ResultFuncPure<V>) => V;
  load: <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V>;
  loadBy: <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V>;
  getValue: (key: K) => V;
  useValue: (key: K) => V;
}

// overload is unsafe in some way, ensure the return type is correct
function createMappedRegion <K, V>(initialValue: void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V, option?: RegionOption): CreateMappedRegionPureReturnValue<K, V>;
// tslint:disable-next-line:max-line-length
function createMappedRegion <K, V>(initialValue: V | void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
  // ---- Utils ----
  type Result = CreateMappedRegionPureReturnValue<K, V>;

  const strategy: Strategy = option?.strategy ?? 'acceptLatest';

  const private_store = createStore<V>();

  const getKeyString = (key: K): string => {
    if (typeof key === 'string') {
      return key;
    }
    return jsonStableStringify(key);
  };

  const getValueOrInitialValue = (value: V | undefined): V => {
    if (value !== undefined) {
      return value;
    }
    return initialValue as V;
  };

  const createHooks = <TReturnType>(getFn: (key: K) => TReturnType) => {
    return (key: K): TReturnType => {
      const subscription = useMemo(
        () => ({
          getCurrentValue: () => getFn(key),
          subscribe: private_store.subscribe,
        }),
        // shallow-equal
        [getFn, getKeyString(key)],
      );
      return useSubscription(subscription);
    };
  };

  // ---- APIs ----
  const set: Result['set'] = (key, resultOrFunc) => {
    const keyString = getKeyString(key);
    // Maybe we can use getValue here
    const maybeSnapshot = private_store.getAttribute(keyString, 'result');
    const snapshot = getValueOrInitialValue(maybeSnapshot);
    const result = getSetResult(resultOrFunc, snapshot);
    private_store.set({ key: keyString, result });
    return result;
  };

  const reset: Result['reset'] = private_store.reset;

  const load: Result['load'] = async (
    key,
    asyncFunction,
    optionOrReducer,
    exOption,
  ) => {
    const option = getCombinedOption(optionOrReducer, exOption);
    if (!isAsync(asyncFunction)) {
      console.warn('set result directly');
      const setKey = typeof key === 'function' ? (key as Function)(option.params) : key;
      return set(setKey, asyncFunction as unknown as any);
    }
    // @ts-ignore
    const params = option.params as TParams;
    return loadBy(key, asyncFunction, option)(params);
  };

  const loadBy: Result['loadBy'] = (
    key,
    asyncFunction,
    optionOrReducer,
    exOption,
  ) => {
    const option = getCombinedOption(optionOrReducer, exOption);

    return async (params) => {
      const loadKey = typeof key === 'function' ? (key as Function)(params) : key;
      const keyString = getKeyString(loadKey);
      const promise = toPromise({ asyncFunction, params });
      private_store.load({ key: keyString, promise });
      /**
       * note
       * 1. always get value after await, so it is the current one
       * 2. ensure if initialValue is gaven, every branch should return initialValueOfKey as T[K]
       */
      try {
        const result = await promise;
        const currentPromise = private_store.getAttribute(keyString, 'promise');
        const snapshot = private_store.getAttribute(keyString, 'result');

        const formattedResult = typeof option.reducer === 'function'
          ? option.reducer(getValueOrInitialValue(snapshot), result, params)
          : result as unknown as V;
        if (strategy === 'acceptLatest' && promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key: keyString });
          return getValueOrInitialValue(snapshot);
        }
        private_store.set({ key: keyString, result: formattedResult });
        return getValueOrInitialValue(formattedResult);
      } catch (error) {
        const currentPromise = private_store.getAttribute(keyString, 'promise');
        const snapshot = private_store.getAttribute(keyString, 'result');

        if (strategy === 'acceptLatest' && promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key: keyString });
          return getValueOrInitialValue(snapshot);
        }
        private_store.set({ key: keyString, result: snapshot, error });
        return getValueOrInitialValue(snapshot);
      }
    };
  };

  const getValue: Result['getValue'] = (key) => {
    const keyString = getKeyString(key);
    const value = private_store.getAttribute(keyString, 'result');
    return getValueOrInitialValue(value);
  };

  const getLoading: Result['getLoading'] = (key) => {
    const keyString = getKeyString(key);
    return formatLoading(private_store.getAttribute(keyString, 'loading'));
  };

  const getError: Result['getError'] = (key) => {
    const keyString = getKeyString(key);
    return formatError(private_store.getAttribute(keyString, 'error'));
  };

  const getFetchTime: Result['getFetchTime'] = (key) => {
    const keyString = getKeyString(key);
    return private_store.getAttribute(keyString, 'fetchTime');
  };

  const useValue: Result['getValue'] = createHooks(getValue);

  const useLoading: Result['getLoading'] = createHooks(getLoading);

  const useError: Result['getError'] = createHooks(getError);

  const useFetchTime: Result['getFetchTime'] = createHooks(getFetchTime);

  return {
    private_getState_just_for_test: private_store.private_getState,
    private_setState_just_for_test: private_store.private_setState,
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

// tslint:disable-next-line:max-file-line-count
export default createMappedRegion;
