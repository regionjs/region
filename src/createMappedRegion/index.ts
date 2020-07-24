import { useEffect, useRef, useState, FC } from 'react';
import * as shallowEqual from 'shallowequal';
import {
  selectPayload,
  selectId,
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
  AsyncFunction, LoadPayload,
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

export interface CreateMappedRegionReturnValue<K, V> {
  private_setState_just_for_test: (value: any) => void;
  set: (key: K, resultOrFunc: V | ResultFunc<V>) => V;
  reset: () => void;
  load: <TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V | void>;
  loadBy: <TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V | void>;
  getMap: (key: K) => {[key: string]: V};
  getId: (key: K) => string | undefined;
  getValue: (key: K) => V | undefined;
  getLoading: (key: K) => boolean;
  getError: (key: K) => Error | undefined;
  getFetchTime: (key: K) => number | undefined;
  getProps: (key: K) => any;
  connectWith: (key: K, Display: any, option?: ConnectOption) => FC<any>;
  connect: (key: K, option?: ConnectOption) => (Display?: any) => FC<any>;
  useMap: (key: K) => {[key: string]: V};
  useId: (key: K) => string | undefined;
  useValue: (key: K) => V | undefined;
  useLoading: (key: K) => boolean;
  useError: (key: K) => Error | undefined;
  useFetchTime: (key: K) => number | undefined;
  useProps: (key: K) => any;
}

export interface CreateMappedRegionPureReturnValue<K, V>
  extends Omit<CreateMappedRegionReturnValue<K, V>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (key: K, resultOrFunc: V | ResultFuncPure<V>) => V;
  load: <TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V>;
  loadBy: <TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V>;
  getValue: (key: K) => V;
  useValue: (key: K) => V;
}

// overload is unsafe in some way, ensure the return type is correct
function createMappedRegion <K extends string, V>(initialValue: void): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion <K extends string, V>(initialValue: V): CreateMappedRegionPureReturnValue<K, V>;
// tslint:disable-next-line:max-line-length
function createMappedRegion <K extends string, V>(initialValue: V | void): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
  // ---- Utils ----
  type Result = CreateMappedRegionPureReturnValue<K, V>;

  const private_store = createStore<{[key: string]: V}>();

  const getValueOrInitialValue = (key: K, value: V | undefined): V => {
    if (value !== undefined) {
      return value;
    }
    return initialValue as V;
  };

  interface GetLoadPayloadParams<TParams, TResult> {
    key: K;
    promise: Promise<TResult>;
    params: TParams;
    option: LoadOption<TParams, TResult, V>;
  }

  type SelectLoadPayload = <TParams, TResult>(
    { key, promise, params, option }: GetLoadPayloadParams<TParams, TResult>,
  ) => LoadPayload<K, TResult>;

  const selectLoadPayload: SelectLoadPayload = (
    { key, promise, params, option },
  ) => {
    const { id } = option;
    const formatId = selectId({ id, params });
    return { key, promise, id: formatId };
  };

  type EqualityFn = <T>(a?: T, b?: T) => boolean;

  const createHooks = <TReturnType>(getFn: (key: any) => TReturnType, equalityFn: EqualityFn) => {
    return (key: K): TReturnType => {
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
      const loadPayload = selectLoadPayload({ key, promise, params, option });
      private_store.load(loadPayload);
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
        if (promise !== currentPromise) {
          // store result for optimize purpose
          private_store.setCache(payload);
          return getValueOrInitialValue(key, snapshot);
        }
        private_store.set(payload);
        return getValueOrInitialValue(key, payload.result);
      } catch (error) {
        const result = private_store.getAttribute(key, 'result');

        private_store.set({ key, result, error });
        return getValueOrInitialValue(key, result);
      }
    };
  };

  const getMap: Result['getMap'] = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'results')) as any;
    }
    return private_store.getAttribute(key, 'results');
  };

  const getId: Result['getId'] = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'id'));
    }
    return private_store.getAttribute(key, 'id');
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

  const useMap: Result['getMap'] = createHooks(getMap, shallowEqual);

  const useId: Result['getId'] = createHooks(getId, strictEqual);

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
    getMap,
    getId,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    getProps,
    connectWith,
    connect,
    useMap,
    useId,
    useValue,
    useLoading,
    useError,
    useFetchTime,
    useProps,
  };
}

// tslint:disable-next-line:max-file-line-count
export default createMappedRegion;
