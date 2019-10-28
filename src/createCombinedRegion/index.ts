import * as shallowEqual from 'shallowequal';
import {
  formatResult,
  formatResultWithId,
  isAsync,
  formatKeys,
  selectLoading,
  selectResult,
  selectFetchTime,
  selectError,
  mapValues,
  formatLoading,
  isValidConnectKey,
  hoc,
  createHooks,
  createStore,
} from '../util';
import {
  EntityName,
  Result,
  AsyncFunction,
  Params,
  Key,
  LoadOption,
  SimpleKey,
  OptionOrReducer,
  State,
  Action,
  BaseKey,
  Props, DisplayType, ConnectOption,
} from '../types';

interface ToPromiseParams {
  asyncFunction: AsyncFunction;
  params: any;
}

const toPromise = async ({ asyncFunction, params }: ToPromiseParams) => {
  if (typeof asyncFunction === 'function') {
    return asyncFunction(params);
  }
  // promise
  return asyncFunction;
};

type GetCombinedOption = (optionOrReducer?: OptionOrReducer, exOption?: LoadOption) => LoadOption;

const getCombinedOption: GetCombinedOption = (optionOrReducer = {}, exOption) => {
  if (typeof optionOrReducer === 'function') {
    if (exOption) {
      return { reducer: optionOrReducer, ...exOption };
    }
    return { reducer: optionOrReducer };
  }
  return optionOrReducer || {};
};

const Empty = () => null;

const strictEqual = (a: any, b: any) => a === b;

const createCombinedRegion = () => {
  const private_store = createStore();

  const private_getState = () => {
    const { getState } = private_store;
    const state = getState();
    return state || {};
  };

  const private_getLoadings = (key: BaseKey) => {
    return mapValues(private_getState(), key, ({ loading }: Props) => formatLoading(loading));
  };

  const private_getResults = (key: BaseKey) => {
    return mapValues(private_getState(), key, ({ result, results, id }: Props) => id ? results[id] : result);
  };

  const private_getFetchTimes = (key: BaseKey) => {
    return mapValues(private_getState(), key, ({ fetchTime }: Props) => fetchTime);
  };

  const private_getErrors = (key: BaseKey) => {
    return mapValues(private_getState(), key, ({ error }: Props) => error);
  };

  const set = (key: EntityName, result: Result, option: LoadOption = {}) => {
    return setBy(key, option)(result);
  };

  const setBy = (key: EntityName, option: LoadOption = {}) => {
    const { format, reducer, id, params } = option;
    const snapshot = private_getResults(key);
    return (result: Result) => {
      if (id !== undefined) {
        const formattedResult = formatResultWithId({ result, snapshot, format, id, reducer, params });
        private_store.set({ key, results: formattedResult, id });
        return formattedResult[id];
      }
      const formattedResult = formatResult({ result, snapshot, format, reducer, params });
      private_store.set({ key, result: formattedResult });
      return formattedResult;
    };
  };

  const reset = private_store.reset;

  const load = async (key: EntityName, asyncFunction: AsyncFunction, optionOrReducer?: OptionOrReducer, exOption?: LoadOption) => {
    const option = getCombinedOption(optionOrReducer, exOption);
    if (!isAsync(asyncFunction)) {
      console.warn('set result directly');
      return set(key, asyncFunction, option);
    }
    return loadBy(key, asyncFunction, option)(option.params);
  };

  const loadBy = (key: EntityName, asyncFunction: AsyncFunction, optionOrReducer?: OptionOrReducer, exOption?: LoadOption) => {
    const option = getCombinedOption(optionOrReducer, exOption);

    return async (params: Params) => {
      private_store.load({ key });
      try {
        const result = await toPromise({ asyncFunction, params });
        return set(key, result, { params, ...option });
      } catch (error) {
        const result = private_getResults(key);
        private_store.set({ key, result, error });
        return result;
      }
    };
  };

  const getProps = (key: Key) => {
    const { keys, loadings, results, fetchTimes, errors } = formatKeys(key);

    const loading = selectLoading(private_getLoadings(loadings));
    const resultMap = selectResult(keys, private_getResults(results));
    const fetchTime = selectFetchTime(private_getFetchTimes(fetchTimes));
    const error = selectError(private_getErrors(errors)) ;
    return Object.assign({ loading, fetchTime, error }, resultMap);
  };

  const getValue = (key: SimpleKey) => {
    return private_getResults(key);
  };

  const getLoading = (key: SimpleKey) => {
    return private_getLoadings(key);
  };

  const getError = (key: SimpleKey) => {
    return private_getErrors(key);
  };

  const getFetchTime = (key: SimpleKey) => {
    return private_getFetchTimes(key);
  };

  const connectWith = (key: Key, Display: DisplayType, option?: ConnectOption) => {
    return connect(key, option)(Display);
  };

  const connect = (key: Key, { Loading, Error: ErrorComponent }: ConnectOption = {}) => (Display: DisplayType = Empty) => {
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

  const useProps: (key: Key) => Props = createHooks({ getFn: getProps, equalityFn: shallowEqual, store: private_store });

  const useValue = createHooks({ getFn: getValue, equalityFn: strictEqual, store: private_store });

  const useLoading = createHooks({ getFn: getLoading, equalityFn: strictEqual, store: private_store });

  const useError = createHooks({ getFn: getError, equalityFn: strictEqual, store: private_store });

  const useFetchTime = createHooks({ getFn: getFetchTime, equalityFn: strictEqual, store: private_store });

  return {
    private_store,
    private_getState,
    private_getLoadings,
    private_getResults,
    private_getFetchTimes,
    private_getErrors,
    set,
    setBy,
    reset,
    load,
    loadBy,
    getProps,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    connectWith,
    connect,
    useProps,
    useValue,
    useLoading,
    useError,
    useFetchTime,
  };
};

// tslint:disable-next-line:max-file-line-count
export default createCombinedRegion;
