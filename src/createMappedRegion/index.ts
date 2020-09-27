import { useEffect, useRef, useState, FC } from 'react';
// tslint:disable-next-line:import-name
import shallowEqual from 'shallowequal';
import jsonStableStringify from 'json-stable-stringify';
import {
  formatResult,
  isAsync,
  selectLoading,
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
  getLoading: (key: K | K[]) => boolean;
  getError: (key: K | K[]) => Error | undefined;
  getFetchTime: (key: K | K[]) => number | undefined;
  getProps: (key: K | K[]) => any;
  connectWith: (key: K, Display: any, option?: ConnectOption) => FC<any>;
  connect: (key: K, option?: ConnectOption) => (Display?: any) => FC<any>;
  useValue: (key: K) => V | undefined;
  useLoading: (key: K | K[]) => boolean;
  useError: (key: K | K[]) => Error | undefined;
  useFetchTime: (key: K | K[]) => number | undefined;
  useProps: (key: K | K[]) => any;
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
function createMappedRegion <K, V>(initialValue: void): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V): CreateMappedRegionPureReturnValue<K, V>;
// tslint:disable-next-line:max-line-length
function createMappedRegion <K, V>(initialValue: V | void): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
  // ---- Utils ----
  type Result = CreateMappedRegionPureReturnValue<K, V>;

  const private_store = createStore<{[key: string]: V}>();

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

  type EqualityFn = <T>(a?: T, b?: T) => boolean;

  const createHooks = <TReturnType>(getFn: (key: K | K[]) => TReturnType, equalityFn: EqualityFn) => {
    return (key: K | K[]): TReturnType => {
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

        const formattedResult = formatResult({ snapshot, result, params, option });
        if (promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key: keyString });
          return getValueOrInitialValue(snapshot);
        }
        private_store.set({ key: keyString, result: formattedResult });
        return getValueOrInitialValue(formattedResult);
      } catch (error) {
        const currentPromise = private_store.getAttribute(keyString, 'promise');
        const snapshot = private_store.getAttribute(keyString, 'result');

        if (promise !== currentPromise) {
          // decrease loading & return snapshot
          private_store.loadEnd({ key: keyString });
          return getValueOrInitialValue(snapshot);
        }
        private_store.set({ key: keyString, result: snapshot, error });
        return getValueOrInitialValue(snapshot);
      }
    };
  };

  // @ts-ignore overload
  const getValue: Result['getValue'] = (key) => {
    if (Array.isArray(key)) {
      return key.map((k: K) => {
        const keyString = getKeyString(k);
        const value = private_store.getAttribute(keyString, 'result');
        return getValueOrInitialValue(value);
      });
    }
    const keyString = getKeyString(key);
    const value = private_store.getAttribute(keyString, 'result');
    return getValueOrInitialValue(value);
  };

  const getLoading: Result['getLoading'] = (key) => {
    if (Array.isArray(key)) {
      return selectLoading(key.map((k: K) => {
        const keyString = getKeyString(k);
        return private_store.getAttribute(keyString, 'loading');
      }));
    }
    const keyString = getKeyString(key);
    return selectLoading([private_store.getAttribute(keyString, 'loading')]);
  };

  const getError: Result['getError'] = (key) => {
    if (Array.isArray(key)) {
      return selectError(key.map((k: K) => {
        const keyString = getKeyString(k);
        return private_store.getAttribute(keyString, 'error');
      }));
    }
    const keyString = getKeyString(key);
    return selectError([private_store.getAttribute(keyString, 'error')]);
  };

  const getFetchTime: Result['getFetchTime'] = (key) => {
    if (Array.isArray(key)) {
      return selectFetchTime(key.map((k: K) => {
        const keyString = getKeyString(k);
        return private_store.getAttribute(keyString, 'fetchTime');
      }));
    }
    const keyString = getKeyString(key);
    return selectFetchTime([private_store.getAttribute(keyString, 'fetchTime')]);
  };

  const getProps: Result['getProps'] = (key) => {
    const resultMap: {[key: string]: V} = {};
    const result: V | V[] = getValue(key as K);
    if (Array.isArray(key)) {
      key.map((k, index) => {
        const keyString = getKeyString(k);
        resultMap[keyString] = (result as unknown as V[])[index];
      });
    } else {
      const keyString = getKeyString(key);
      resultMap[keyString] = result as V;
    }

    const loading = getLoading(key);
    const fetchTime = getFetchTime(key);
    const error = getError(key);

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

  // @ts-ignore
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
export default createMappedRegion;
