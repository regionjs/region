import {useMemo} from 'react';
import * as jsonStableStringify from 'json-stable-stringify';
import {useSubscription} from 'use-subscription';
import {deprecate} from '../util';
import {
    ResultFunc,
    ResultFuncPure,
    Strategy,
    RegionOption,
    Listener,
    Props,
} from '../types';

const increase = (v: number = 0) => (v + 1);
const decrease = (v: number = 0) => (v - 1 > 0 ? v - 1 : 0);

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

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
    if (typeof resultOrFunc === 'function') {
        return (resultOrFunc as ResultFuncPure<V>)(snapshot);
    }
    return resultOrFunc;
};

interface LoadBy<K, V, Extend> {
  (
    key: K | (() => K),
    asyncFunction: () => Promise<V>,
  ): () => Promise<void>;
  <TResult = unknown>(
    key: K | (() => K),
    asyncFunction: () => Promise<TResult>,
    reducer: (state: V | Extend, result: TResult) => V,
  ): () => Promise<void>;
  <TParams = void>(
    key: K | ((params: TParams) => K),
    asyncFunction: (params: TParams) => Promise<V>,
  ): (params: TParams) => Promise<void>;
  <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: (params: TParams) => Promise<TResult>,
    reducer: (state: V | Extend, result: TResult, params: TParams) => V,
  ): (params: TParams) => Promise<void>;
}

export interface CreateMappedRegionReturnValue<K, V> {
  private_getState_just_for_test: () => any;
  private_setState_just_for_test: (value: any) => void;
  set: (key: K, resultOrFunc: V | ResultFunc<V>) => void;
  reset: (key: K) => void;
  resetAll: () => void;
  // emit: (key: K) => void;
  // emitAll: () => void;
  load: (key: K, promise: Promise<V>) => Promise<void>;
  loadBy: LoadBy<K, V, undefined>;
  getValue: (key: K) => V | undefined;
  getLoading: (key: K) => boolean;
  getError: (key: K) => Error | undefined;
  getPromise: (key: K) => Promise<V> | undefined;
  useValue: {
    (key: K): V | undefined;
    <TResult>(key: K, selector: (value: V | undefined) => TResult): TResult;
  };
  useLoading: (key: K) => boolean;
  useError: (key: K) => Error | undefined;
  useData: {
      (key: K, fetcher: () => Promise<void>): V;
      <TResult>(key: K, fetcher: () => Promise<void>, selector: (value: V) => TResult): TResult;
  };
}

export interface CreateMappedRegionPureReturnValue<K, V>
  extends Omit<CreateMappedRegionReturnValue<K, V>, 'set' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (key: K, resultOrFunc: V | ResultFuncPure<V>) => void;
  loadBy: LoadBy<K, V, never>;
  getValue: (key: K) => V;
  useValue: {
    (key: K): V;
    <TResult>(key: K, selector: (value: V) => TResult): TResult;
  };
}

// overload is unsafe in some way, ensure the return type is correct
function createMappedRegion <K, V>(initialValue: void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V, option?: RegionOption): CreateMappedRegionPureReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V | void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
  type Result = CreateMappedRegionPureReturnValue<K, V>;

  const strategy: Strategy = option?.strategy ?? 'acceptLatest';

  interface PrivateStoreState {
    [key: string]: Props<V>;
  }
  interface PrivateStoreStateRef {
    current: PrivateStoreState;
  }
  const private_stateRef: PrivateStoreStateRef = {
      current: {},
  };

  const private_store_ensure = (key: string): void => {
      if (!private_stateRef.current[key]) {
          private_stateRef.current[key] = {};
      }
  };

  const private_store_emit = (key: string): void => {
      const props = private_stateRef.current[key];
      if (!props) {
          return;
      }
      const {listeners} = props;
      if (!listeners) {
          return;
      }
      listeners.forEach(listener => listener());
  };

  // only used for test
  const private_store_getState = (): PrivateStoreState => {
      return private_stateRef.current;
  };

  // only used for test
  const private_store_setState = (value: PrivateStoreState): void => {
      private_stateRef.current = value;
  };

  const private_store_getAttribute = <A extends keyof Props<V>>(key: string, attribute: A): Props<V>[A] => {
      const props = private_stateRef.current[key];
      if (!props) {
          return undefined;
      }
      return props[attribute];
  };

  const private_store_load = (key: string, promise: Promise<V>): void => {
      private_store_ensure(key);

      // since it is ensured
      const props = private_stateRef.current[key];

      props.promise = promise;
      props.pendingMutex = increase(props.pendingMutex);
      private_store_emit(key);
  };

  const private_store_loadEnd = (key: string): void => {
      private_store_ensure(key);

      // since it is ensured
      const props = private_stateRef.current[key];

      props.pendingMutex = decrease(props.pendingMutex);
      private_store_emit(key);
  };

  const private_store_set = (key: string, value: V): void => {
      private_store_ensure(key);

      // since it is ensured
      const props = private_stateRef.current[key];

      const snapshot = props.value;
      const formatValue = typeof value === 'function' ? value(snapshot) : value;
      props.pendingMutex = decrease(props.pendingMutex);
      props.value = formatValue;
      props.error = undefined; // reset error

      private_store_emit(key);
  };

  const private_store_setError = (key: string, error: unknown): void => {
      private_store_ensure(key);

      // since it is ensured
      const props = private_stateRef.current[key];

      props.pendingMutex = decrease(props.pendingMutex);
      props.error = error;

      if (error) {
          console.error(error);
      }
      private_store_emit(key);
  };

  const private_store_reset = (key: string): void => {
      private_stateRef.current[key] = {listeners: private_stateRef.current[key]?.listeners};
      private_store_emit(key);
  };

  const private_store_resetAll = (): void => {
      Object.keys(private_stateRef.current).forEach((key: string) => {
          private_stateRef.current[key] = {listeners: private_stateRef.current[key]?.listeners};
          private_store_emit(key);
      });
  };

  // TODO add a regress test to prevent shadow variable usage of listeners
  const private_store_subscribe = (key: string, listener: Listener): () => void => {
      private_store_ensure(key);

      // since it is ensured
      const props = private_stateRef.current[key];

      if (!props.listeners) {
          props.listeners = [];
      }

      if (typeof listener === 'function') {
          props.listeners.push(listener);
      } else {
          console.warn(`listener should be function, but received ${listener}`);
      }

      return () => {
          private_store_ensure(key);

          // since it is ensured
          const props = private_stateRef.current[key];
          if (!props.listeners) {
              props.listeners = [];
          }
          props.listeners.splice(props.listeners.indexOf(listener), 1);
      };
  };
  /* -------- */

  const getKeyString = (key: K | K[]): string => {
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

  // ---- APIs ----
  const set: Result['set'] = (key, resultOrFunc) => {
      const keyString = getKeyString(key);
      // Maybe we can use getValue here
      const maybeSnapshot = private_store_getAttribute(keyString, 'value');
      const snapshot = getValueOrInitialValue(maybeSnapshot);
      const result = getSetResult(resultOrFunc, snapshot);
      private_store_set(keyString, result);
      return result;
  };

  const reset: Result['reset'] = (key: K) => {
      if (key === undefined) {
          deprecate('reset should be called with key, use resetAll to reset all keys.');
          private_store_resetAll();
      }
      const keyString = getKeyString(key);
      private_store_reset(keyString);
  };

  const resetAll: Result['resetAll'] = private_store_resetAll;

  // const emit: Result['emit'] = (key: K) => {
  //   const keyString = getKeyString(key);
  //   private_store_emit(keyString);
  // };
  //
  // const emitAll: Result['emitAll'] = private_store_emitAll;

  const toPromise = async <TParams, TResult>(
      asyncFunction: (params: TParams) => Promise<TResult>,
      reducer?: (state: V, result: TResult, params: TParams) => V,
      params?: TParams,
      // @ts-ignore
      getReducerState: () => V
  ): Promise<V> => {
      // maybe promise, asyncFunction may return native value
      const promise = typeof asyncFunction === 'function' ? asyncFunction(params as TParams) : asyncFunction;
      if (typeof reducer === 'function') {
          const result = await promise;
          return reducer(getReducerState(), result, params as TParams);
      }
      return promise as unknown as Promise<V>;
  };

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
      key: K | ((params: TParams) => K),
      asyncFunction: (params: TParams) => Promise<TResult>,
      reducer?: (state: V, result: TResult, params: TParams) => V
  ) => {
      const loadByReturnFunction = async (params?: TParams) => {
          const loadKey = typeof key === 'function' ? (key as any)(params) : key;
          const keyString = getKeyString(loadKey);
          const promise = toPromise(asyncFunction, reducer, params, () => getValueOrInitialValue(private_store_getAttribute(keyString, 'value')));
          private_store_load(keyString, promise);
          /**
       * note
       * 1. always get value after await, so it is the current one
       * 2. ensure if initialValue is gaven, every branch should return initialValueOfKey as T[K]
       */
          try {
              const result = await promise;
              const currentPromise = private_store_getAttribute(keyString, 'promise');
              const snapshot = private_store_getAttribute(keyString, 'value');

              if (strategy === 'acceptLatest' && promise !== currentPromise) {
                  // decrease loading & return snapshot
                  private_store_loadEnd(keyString);
                  return getValueOrInitialValue(snapshot) as never;
              }
              private_store_set(keyString, result);
              return getValueOrInitialValue(result) as never;
          } catch (error) {
              const currentPromise = private_store_getAttribute(keyString, 'promise');
              const snapshot = private_store_getAttribute(keyString, 'value');

              if (strategy === 'acceptLatest' && promise !== currentPromise) {
                  // decrease loading & return snapshot
                  private_store_loadEnd(keyString);
                  return getValueOrInitialValue(snapshot) as never;
              }
              private_store_setError(keyString, error);
              return getValueOrInitialValue(snapshot) as never;
          }
      };

      return loadByReturnFunction;
  };

  const load: Result['load'] = async (key, promise) => {
      if (promise instanceof Promise || typeof promise === 'function') {
          return loadBy(key, promise as unknown as any)();
      }
      console.warn('set result directly');
      return set(key, promise);
  };

  const getValue: Result['getValue'] = key => {
      const keyString = getKeyString(key);
      const value = private_store_getAttribute(keyString, 'value');
      return getValueOrInitialValue(value);
  };

  const getLoading: Result['getLoading'] = key => {
      const keyString = getKeyString(key);
      return formatLoading(private_store_getAttribute(keyString, 'pendingMutex'));
  };

  const getError: Result['getError'] = key => {
      const keyString = getKeyString(key);
      return formatError(private_store_getAttribute(keyString, 'error'));
  };

  const getPromise: Result['getPromise'] = key => {
      const keyString = getKeyString(key);
      const promise = private_store_getAttribute(keyString, 'promise');
      return promise;
  };

  const createHooks = <TReturnType>(getFn: (key: K) => TReturnType) => {
      return (key: K): TReturnType => {
          const subscription = useMemo(
              () => ({
                  getCurrentValue: () => getFn(key),
                  subscribe: (listener: Listener) => private_store_subscribe(getKeyString(key), listener),
              }),
              // shallow-equal
              // eslint-disable-next-line react-hooks/exhaustive-deps
              [getFn, getKeyString(key)]
          );
          return useSubscription(subscription);
      };
  };

  const useValue: Result['useValue'] = <TResult>(key: K, selector?: (value: V) => TResult) => {
      // keep logic as createHook is
      const getFn = getValue;
      const subscription = useMemo(
          () => ({
              getCurrentValue: () => (selector ? selector(getFn(key)) : getFn(key)),
              subscribe: (listener: Listener) => private_store_subscribe(getKeyString(key), listener),
          }),
          // shallow-equal
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [getFn, selector, getKeyString(key)]
      );
      return useSubscription(subscription);
  };

  const useData: Result['useData'] = <TResult>(key: K, fetcher: () => Promise<void>, selector?: (value: V) => TResult) => {
      // keep logic as createHook is
      const getFn = getValue;
      const subscription = useMemo(
          () => ({
              getCurrentValue: () => (selector ? selector(getFn(key)) : getFn(key)),
              subscribe: (listener: Listener) => private_store_subscribe(getKeyString(key), listener),
          }),
          // shallow-equal
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [getFn, selector, getKeyString(key)]
      );
      const currentPromise = useMemo(
          () => getPromise(key),
          // shallow-equal
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [getPromise, getKeyString(key)]
      );
      if (subscription.getCurrentValue() === undefined) {
          if (currentPromise) {
              throw currentPromise;
          } else {
              // fetcher may cause infinite loop?
              throw fetcher();
          }
      }
      return useSubscription(subscription);
  };

  const useLoading: Result['useLoading'] = createHooks(getLoading);

  const useError: Result['useError'] = createHooks(getError);

  return {
      private_getState_just_for_test: private_store_getState,
      private_setState_just_for_test: private_store_setState,
      set,
      reset,
      resetAll,
      // emit,
      // emitAll,
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

export default createMappedRegion;
