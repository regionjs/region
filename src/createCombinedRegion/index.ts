import { useEffect, useRef, useState } from 'react';
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
  ResultOrFunc,
  ResultFunc,
  AsyncFunctionOrPromise,
  AsyncFunctionOrPromiseWithoutParams,
  LoadOption,
  OptionOrReducer,
  DisplayType,
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

const getSetResult = <V>(resultOrFunc: ResultOrFunc<V>, snapshot?: V) => {
  if (typeof resultOrFunc === 'function') {
    return (resultOrFunc as ResultFunc<V>)(snapshot);
  }
  return resultOrFunc;
};

const createCombinedRegion = <T>() => {
  const private_store = createStore<T>();

  type Set = <K extends keyof T>(key: K, resultOrFunc: ResultOrFunc<T[K]>) => T[K];

  const set: Set = (key, resultOrFunc) => {
    const snapshot = private_store.getAttribute(key, 'result');
    const result = getSetResult(resultOrFunc, snapshot);
    private_store.set({ key, result });
    return result;
  };

  const reset = private_store.reset;

  interface GetLoadPayloadParams<K extends keyof T, TParams, TResult> {
    key: K;
    promise: Promise<TResult>;
    params: TParams;
    option: LoadOption<TParams, TResult, T[K]>;
  }

  type SelectLoadPayload = <K extends keyof T, TParams, TResult>(
    { key, promise, params, option }: GetLoadPayloadParams<K, TParams, TResult>,
  ) => LoadPayload<K, TResult>;

  const selectLoadPayload: SelectLoadPayload = (
    { key, promise, params, option },
  ) => {
    const { id } = option;
    const formatId = selectId({ id, params });
    return { key, promise, id: formatId };
  };

  type Load = <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => Promise<T[K] | void>;

  const load: Load = async (
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

  type LoadBy = <K extends keyof T, TParams = void, TResult = unknown>(
    key: K,
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, T[K]>,
    exOption?: LoadOption<TParams, TResult, T[K]>,
  ) => (params: TParams) => Promise<T[K] | void>;

  const loadBy: LoadBy = (
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
      try {
        const result = await promise;
        const currentPromise = private_store.getAttribute(key, 'promise');
        const snapshot = private_store.getAttribute(key, 'result');
        const payload = selectPayload({ key, snapshot, result, params, option });
        if (promise !== currentPromise) {
          // store result for optimize purpose
          private_store.setCache(payload);
          return snapshot;
        }
        private_store.set(payload);
        return payload.result;
      } catch (error) {
        const result = private_store.getAttribute(key, 'result');
        private_store.set({ key, result, error });
        return result;
      }
    };
  };

  type GetMap = <K extends keyof T>(key: K) => {[key: string]: T[K]};

  const getMap: GetMap = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'results')) as any;
    }
    return private_store.getAttribute(key, 'results');
  };

  type GetId = <K extends keyof T>(key: K) => string | undefined;

  const getId: GetId = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'id'));
    }
    return private_store.getAttribute(key, 'id');
  };

  type GetValue = <K extends keyof T>(key: K) => T[K] | undefined;

  const getValue: GetValue = (key) => {
    if (Array.isArray(key)) {
      return key.map(k => private_store.getAttribute(k, 'result')) as any;
    }
    return private_store.getAttribute(key, 'result');
  };

  type GetLoading = <K extends keyof T>(key: K) => boolean;

  const getLoading: GetLoading = (key) => {
    if (Array.isArray(key)) {
      return selectLoading(key.map(k => private_store.getAttribute(k, 'loading')));
    }
    return selectLoading([private_store.getAttribute(key, 'loading')]);
  };

  type GetError = <K extends keyof T>(key: K) => Error | undefined;

  const getError: GetError = (key) => {
    if (Array.isArray(key)) {
      return selectError(key.map(k => private_store.getAttribute(k, 'error')));
    }
    return selectError([private_store.getAttribute(key, 'error')]);
  };

  type GetFetchTime = <K extends keyof T>(key: K) => number | undefined;

  const getFetchTime: GetFetchTime = (key) => {
    if (Array.isArray(key)) {
      return selectFetchTime(key.map(k => private_store.getAttribute(k, 'fetchTime')));
    }
    return selectFetchTime([private_store.getAttribute(key, 'fetchTime')]);
  };

  type GetProps = <K extends keyof T>(key: K) => any;

  const getProps: GetProps = (key) => {
    const { keys, loadings, results, fetchTimes, errors } = formatLegacyKeys(key);

    const loading = getLoading(loadings);
    const resultMap = selectResult(keys, getValue(results) as any);
    const fetchTime = getFetchTime(fetchTimes);
    const error = getError(errors);

    return Object.assign({ loading, fetchTime, error }, resultMap);
  };

  const connectWith = <K extends keyof T>(key: K, Display: DisplayType, option?: ConnectOption) => {
    return connect(key, option)(Display);
  };

  const connect = <K extends keyof T>(key: K, { Loading, Error: ErrorComponent }: ConnectOption = {}) => (Display: DisplayType = Empty) => {
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

  const useProps: GetProps = createHooks(getProps, shallowEqual);

  const useMap: GetMap = createHooks(getMap, shallowEqual);

  const useId: GetId = createHooks(getId, strictEqual);

  const useValue: GetValue = createHooks(getValue, strictEqual);

  const useLoading: GetLoading = createHooks(getLoading, strictEqual);

  const useError: GetError = createHooks(getError, strictEqual);

  const useFetchTime: GetFetchTime = createHooks(getFetchTime, strictEqual);

  return {
    private_setState_just_for_test: private_store.private_setState,
    set,
    reset,
    load,
    loadBy,
    getProps,
    getMap,
    getId,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    connectWith,
    connect,
    useProps,
    useValue,
    useMap,
    useId,
    useLoading,
    useError,
    useFetchTime,
  };
};

// tslint:disable-next-line:max-file-line-count
export default createCombinedRegion;
