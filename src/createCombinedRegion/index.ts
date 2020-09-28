import { useEffect, useRef, useState, FC } from 'react';
// tslint:disable-next-line:import-name
import shallowEqual from 'shallowequal';
import {
  selectPayload,
  isAsync,
  formatLegacyKeys,
  selectLoading,
  selectResult,
  selectFetchTime,
  selectError,
  isValidConnectKey,
  hoc,
  createStore,
} from '../util';
import {
  ResultFunc,
  ResultFuncPure,
  AsyncFunctionOrPromise,
  LoadOption,
  OptionOrReducer,
  ConnectOption,
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

const Empty = () => null;

const strictEqual = (a: any, b: any) => a === b;

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
  if (typeof resultOrFunc === 'function') {
    return (resultOrFunc as ResultFuncPure<V>)(snapshot);
  }
  return resultOrFunc;
};

export interface CreateCombinedRegionReturnValue<T> {
  private_setState_just_for_test: (value: any) => void;
  set: <K extends keyof T>(key: K, resultOrFunc: T[K] | ResultFunc<T[K]>) => T[K];
  reset: () => void;
  load: <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => Promise<T[K] | void>;
  loadBy: <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => (params: TParams) => Promise<T[K] | void>;
  getValue: <K extends keyof T>(key: K) => T[K] | undefined;
  getLoading: <K extends keyof T>(key: K) => boolean;
  getError: <K extends keyof T>(key: K) => Error | undefined;
  getFetchTime: <K extends keyof T>(key: K) => number | undefined;
  getProps: <K extends keyof T>(key: K) => any;
  connectWith: <K extends keyof T>(key: K, Display: any, option?: ConnectOption) => FC<any>;
  connect: <K extends keyof T>(key: K, option?: ConnectOption) => (Display?: any) => FC<any>;
  useValue: <K extends keyof T>(key: K) => T[K] | undefined;
  useLoading: <K extends keyof T>(key: K) => boolean;
  useError: <K extends keyof T>(key: K) => Error | undefined;
  useFetchTime: <K extends keyof T>(key: K) => number | undefined;
  useProps: <K extends keyof T>(key: K) => any;
}

export interface CreateCombinedRegionPureReturnValue<T>
  extends Omit<CreateCombinedRegionReturnValue<T>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: <K extends keyof T>(key: K, resultOrFunc: T[K] | ResultFuncPure<T[K]>) => T[K];
  load: <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => Promise<T[K]>;
  loadBy: <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => (params: TParams) => Promise<T[K]>;
  getValue: <K extends keyof T>(key: K) => T[K];
  useValue: <K extends keyof T>(key: K) => T[K];
}

// overload is unsafe in some way, ensure the return type is correct
function createCombinedRegion <T>(initialValue: void | undefined, option?: RegionOption): CreateCombinedRegionReturnValue<T>;
function createCombinedRegion <T>(initialValue: T, option?: RegionOption): CreateCombinedRegionPureReturnValue<T>;
// tslint:disable-next-line:max-line-length
function createCombinedRegion <T>(initialValue: T | void | undefined, option?: RegionOption): CreateCombinedRegionReturnValue<T> | CreateCombinedRegionPureReturnValue<T> {
  // ---- Utils ----
  type Result = CreateCombinedRegionPureReturnValue<T>;

  const strategy: Strategy = option?.strategy ?? 'acceptLatest';

  const private_store = createStore<T>();

  const getValueOrInitialValue = <K extends keyof T>(key: K, value: T[K] | undefined): T[K] => {
    if (value !== undefined) {
      return value;
    }
    return (initialValue && initialValue[key]) as T[K];
  };

  type EqualityFn = <T>(a?: T, b?: T) => boolean;

  const createHooks = <TReturnType>(getFn: (key: any) => TReturnType, equalityFn: EqualityFn) => {
    return <K extends keyof T>(key: K): TReturnType => {
      const [, forceUpdate] = useState({});
      const ref = useRef<TReturnType>();
      ref.current = getFn(key);
      useEffect(
        () => {
          let didUnsubscribe = false;

          const checkForUpdates = () => {
            if (didUnsubscribe) {
              return;
            }
            const nextValue = getFn(key);
            /** @see https://github.com/facebook/react/issues/14994 */
            if (!equalityFn(ref.current, nextValue)) {
              ref.current = nextValue;
              forceUpdate({});
            }
          };

          const unsubscribe = private_store.subscribe(checkForUpdates);

          checkForUpdates();

          return () => {
            didUnsubscribe = true;
            unsubscribe();
          };
        },
        [],
      );
      return ref.current;
    };
  };

  // ---- APIs ----
  const set: Result['set'] = (key, resultOrFunc) => {
    // Maybe we can use getValue here
    const maybeSnapshot = private_store.getAttribute(key, 'result');
    const snapshot = getValueOrInitialValue(key, maybeSnapshot);
    const result = getSetResult(resultOrFunc, snapshot);
    private_store.set({ key, result });
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
      return set(key, asyncFunction as unknown as any);
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
      const promise = toPromise({ asyncFunction, params });
      private_store.load({ key, promise });
      /**
       * note
       * 1. always get value after await, so it is the current one
       * 2. ensure if initialValue is gaven, every branch should return initialValueOfKey as T[K]
       */
      try {
        const result = await promise;
        const currentPromise = private_store.getAttribute(key, 'promise');
        const snapshot = private_store.getAttribute(key, 'result');

        const payload = selectPayload({ key, snapshot, result, params, option });
        if (strategy === 'acceptLatest' && promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key });
          return getValueOrInitialValue(key, snapshot);
        }
        private_store.set(payload);
        return getValueOrInitialValue(key, payload.result);
      } catch (error) {
        const currentPromise = private_store.getAttribute(key, 'promise');
        const snapshot = private_store.getAttribute(key, 'result');

        if (strategy === 'acceptLatest' && promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key });
          return getValueOrInitialValue(key, snapshot);
        }
        private_store.set({ key, result: snapshot, error });
        return getValueOrInitialValue(key, snapshot);
      }
    };
  };

  const getValue: Result['getValue'] = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'result')) as any;
    }
    const value = private_store.getAttribute(key, 'result');
    return getValueOrInitialValue(key, value);
  };

  const getLoading: Result['getLoading'] = (key) => {
    if (Array.isArray(key)) {
      return selectLoading(key.map(k => private_store.getAttribute(k, 'loading')));
    }
    return selectLoading([private_store.getAttribute(key, 'loading')]);
  };

  const getError: Result['getError'] = (key) => {
    if (Array.isArray(key)) {
      return selectError(key.map(k => private_store.getAttribute(k, 'error')));
    }
    return selectError([private_store.getAttribute(key, 'error')]);
  };

  const getFetchTime: Result['getFetchTime'] = (key) => {
    if (Array.isArray(key)) {
      return selectFetchTime(key.map(k => private_store.getAttribute(k, 'fetchTime')));
    }
    return selectFetchTime([private_store.getAttribute(key, 'fetchTime')]);
  };

  const getProps: Result['getProps'] = (key) => {
    const { keys, loadings, results, fetchTimes, errors } = formatLegacyKeys(key);

    const loading = getLoading(loadings);
    const resultMap = selectResult(keys, getValue(results) as any);
    const fetchTime = getFetchTime(fetchTimes);
    const error = getError(errors);

    return Object.assign({ loading, fetchTime, error }, resultMap);
  };

  const connectWith: Result['connectWith'] = (key, Display, option) => {
    return connect(key, option)(Display);
  };

  const connect: Result['connect'] = (key, option = {}) => (Display = Empty) => {
    const { Loading, Error: ErrorComponent } = option;
    if (!isValidConnectKey(key)) {
      throw new Error('invalid key.');
    }
    return hoc({
      Display,
      Loading: Loading || Display,
      Error: ErrorComponent || Display,
      useProps,
      key,
    });
  };

  const useProps: Result['getProps'] = createHooks(getProps, shallowEqual);

  const useValue: Result['getValue'] = createHooks(getValue, strictEqual);

  const useLoading: Result['getLoading'] = createHooks(getLoading, strictEqual);

  const useError: Result['getError'] = createHooks(getError, strictEqual);

  const useFetchTime: Result['getFetchTime'] = createHooks(getFetchTime, strictEqual);

  return {
    private_setState_just_for_test: private_store.private_setState,
    set,
    reset,
    load,
    loadBy,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    getProps,
    connectWith,
    connect,
    useValue,
    useLoading,
    useError,
    useFetchTime,
    useProps,
  };
}

// tslint:disable-next-line:max-file-line-count
export default createCombinedRegion;
