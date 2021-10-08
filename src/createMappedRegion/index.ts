import {useMemo} from 'react';
import * as jsonStableStringify from 'json-stable-stringify';
import {useSubscription} from 'use-subscription';
import {deprecate} from '../util';
import {
    ResultFunc,
    ResultFuncPure,
    AsyncFunctionOrPromise,
    Reducer,
    ReducerPure,
    Strategy,
    RegionOption,
    Listener,
    Props,
} from '../types';

const increase = (v: number = 0) => (v + 1);
const decrease = (v: number = 0) => (v - 1 > 0 ? v - 1 : 0);

interface ToPromiseParams<TParams, V> {
  asyncFunction: AsyncFunctionOrPromise<TParams, V>;
  params: any;
}

const toPromise = async <TParams, V>({asyncFunction, params}: ToPromiseParams<TParams, V>) => {
    if (typeof asyncFunction === 'function') {
        return asyncFunction(params);
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

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
    if (typeof resultOrFunc === 'function') {
        return (resultOrFunc as ResultFuncPure<V>)(snapshot);
    }
    return resultOrFunc;
};

interface LoadBy<K, V> {
  <TParams = void>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
  ): (params: TParams) => Promise<V | void>;
  <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: Reducer<TParams, TResult, V>,
  ): (params: TParams) => Promise<V | void>;
}

interface LoadByPure<K, V> {
  <TParams = void>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, V>,
  ): (params: TParams) => Promise<V>;
  <TParams = void, TResult = unknown>(
    key: K | ((params: TParams) => K),
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    reducer: ReducerPure<TParams, TResult, V>,
  ): (params: TParams) => Promise<V>;
}

export interface CreateMappedRegionReturnValue<K, V> {
  private_getState_just_for_test: () => any;
  private_setState_just_for_test: (value: any) => void;
  set: (key: K, resultOrFunc: V | ResultFunc<V>) => V;
  reset: (key: K) => void;
  resetAll: () => void;
  // emit: (key: K) => void;
  // emitAll: () => void;
  load: (key: K, promise: Promise<V>) => Promise<V>;
  loadBy: LoadBy<K, V>;
  getValue: (key: K) => V | undefined;
  getLoading: (key: K) => boolean;
  getError: (key: K) => Error | undefined;
  useValue: {
    (key: K): V | undefined;
    <TResult>(key: K, selector: (value: V | undefined) => TResult): TResult;
  };
  useLoading: (key: K) => boolean;
  useError: (key: K) => Error | undefined;
}

export interface CreateMappedRegionPureReturnValue<K, V>
  extends Omit<CreateMappedRegionReturnValue<K, V>, 'set' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (key: K, resultOrFunc: V | ResultFuncPure<V>) => V;
  loadBy: LoadByPure<K, V>;
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

  const private_store_load = <TResult>(key: string, promise: Promise<TResult>): void => {
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
      private_stateRef.current[key] = {listeners: private_stateRef.current[key].listeners};
      private_store_emit(key);
  };

  const private_store_resetAll = (): void => {
      Object.keys(private_stateRef.current).forEach((key: string) => {
          private_stateRef.current[key] = {listeners: private_stateRef.current[key].listeners};
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

  const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
      key: K | ((params: TParams) => K),
      asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
      reducer?: ReducerPure<TParams, TResult, V>
  ): (params: TParams) => Promise<V> => {
      return async params => {
          const loadKey = typeof key === 'function' ? (key as any)(params) : key;
          const keyString = getKeyString(loadKey);
          const promise = toPromise({asyncFunction, params});
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

              const formattedResult = typeof reducer === 'function'
                  ? reducer(getValueOrInitialValue(snapshot), result, params)
                  : result as unknown as V;
              if (strategy === 'acceptLatest' && promise !== currentPromise) {
                  // decrease loading & return snapshot
                  private_store_loadEnd(keyString);
                  return getValueOrInitialValue(snapshot);
              }
              private_store_set(keyString, formattedResult);
              return getValueOrInitialValue(formattedResult);
          } catch (error) {
              const currentPromise = private_store_getAttribute(keyString, 'promise');
              const snapshot = private_store_getAttribute(keyString, 'value');

              if (strategy === 'acceptLatest' && promise !== currentPromise) {
                  // decrease loading & return snapshot
                  private_store_loadEnd(keyString);
                  return getValueOrInitialValue(snapshot);
              }
              private_store_setError(keyString, error);
              return getValueOrInitialValue(snapshot);
          }
      };
  };

  const load: Result['load'] = async (key, asyncFunction) => {
      if (asyncFunction instanceof Promise || typeof asyncFunction === 'function') {
          return loadBy(key, asyncFunction as unknown as any)();
      }
      console.warn('set result directly');
      const setKey = typeof key === 'function' ? (key as any)() : key;
      return set(setKey, asyncFunction as unknown as any) as unknown as Promise<V>;
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
      useValue,
      useLoading,
      useError,
  };
}

export default createMappedRegion;
