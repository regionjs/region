import RegionPrivate from './RegionPrivate';
import { formatResult, shouldThrottle, isAsync, deprecate, formatKeys, selectLoading, selectResult, selectFetchTime, selectError } from '../util';
import { EntityName, Result, AsyncFunction, Params, Key, LoadOption, SimpleKey, Reducer } from '../types';
import { formatResultWithId } from '../util/formatResult';

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

type GetCombinedOption = (optionOrReducer?: LoadOption | Reducer, exOption?: LoadOption) => LoadOption;

const getCombinedOption: GetCombinedOption = (optionOrReducer = {}, exOption) => {
  if (typeof optionOrReducer === 'function') {
    if (exOption) {
      return { reducer: optionOrReducer, ...exOption };
    }
    return { reducer: optionOrReducer };
  }
  return optionOrReducer || {};
};

class RegionPublic extends RegionPrivate {
  /**
   * @param key string
   * @param result any
   * @param option
   * @param option.format (result, snapshot) => any
   */
  set = (key: EntityName, result: Result, option: LoadOption = {}) => {
    const { setBy } = this;
    return setBy(key, option)(result);
  }

  /**
   * @param key string
   * @param option
   * @param option.format (result, snapshot) => any | A function format result to other data structure
   */
  setBy = (key: EntityName, option: LoadOption = {}) => {
    const { format, reducer, id, params } = option;
    const { private_store, private_getResults: getResults, private_actionTypes } = this;
    const { SET } = private_actionTypes;
    const { dispatch } = private_store;
    const snapshot = getResults(key);
    // TODO optimize setBy
    return (result: Result) => {
      if (id !== undefined) {
        // TODO TEST ME
        const formattedResult = formatResultWithId({ result, snapshot, format, id, reducer, params });
        dispatch({ type: SET, payload: { key, results: formattedResult, id } });
        return formattedResult[id];
      }
      const formattedResult = formatResult({ result, snapshot, format, reducer, params });
      dispatch({ type: SET, payload: { key, result: formattedResult } });
      return formattedResult;
    };
  }

  reset = () => {
    const { private_store, private_actionTypes } = this;
    const { RESET } = private_actionTypes;
    const { dispatch } = private_store;
    dispatch({ type: RESET });
  }

  load = async (key: EntityName, asyncFunction: AsyncFunction, optionOrReducer?: LoadOption | Reducer, exOption?: LoadOption) => {
    const option = getCombinedOption(optionOrReducer, exOption);
    if (!isAsync(asyncFunction)) {
      console.warn('set result directly');
      const { set } = this;
      return set(key, asyncFunction, option);
    }
    const { loadBy } = this;
    return loadBy(key, asyncFunction, option)(option.params);
  }

  loadBy = (key: EntityName, asyncFunction: AsyncFunction, optionOrReducer?: LoadOption | Reducer, exOption?: LoadOption) => {
    const option = getCombinedOption(optionOrReducer, exOption);
    const { forceUpdate } = option;
    const { private_store, private_getResults: getResults, private_actionTypes, expiredTime, private_getFetchTimes: getFetchTimes, set } = this;
    const { LOAD, SET } = private_actionTypes;
    const { dispatch } = private_store;
    const snapshot = getResults(key);

    return async (params: Params) => {
      if (shouldThrottle({ asyncFunction, forceUpdate, key, snapshot, expiredTime, getFetchTimes })) {
        deprecate('Snapshot inject is deprecated. If you do not want it load, you can simply not load it. You can get fetchTime in getProps method to control your load function.'); // tslint:disable max-line-length
        return snapshot;
      }
      dispatch({ type: LOAD, payload: { key } });
      try {
        const result = await toPromise({ asyncFunction, params });
        return set(key, result, { params, ...option });
      } catch (error) {
        dispatch({ type: SET, payload: { key, result: undefined, error } });
        return undefined;
      }
    };
  }

  getProps = (key: Key) => {
    const {
      private_getLoadings,
      private_getResults,
      private_getFetchTimes,
      private_getErrors,
    } = this;
    const { keys, loadings, results, fetchTimes, errors } = formatKeys(key);

    const loading = selectLoading(private_getLoadings(loadings));
    const resultMap = selectResult(keys, private_getResults(results));
    const fetchTime = selectFetchTime(private_getFetchTimes(fetchTimes));
    const error = selectError(private_getErrors(errors)) ;
    return Object.assign({ loading, fetchTime, error }, resultMap);
  }

  getValue = (key: SimpleKey) => {
    return this.private_getResults(key);
  }

  getLoading = (key: SimpleKey) => {
    return this.private_getLoadings(key);
  }

  getError = (key: SimpleKey) => {
    return this.private_getErrors(key);
  }

  getFetchTime = (key: SimpleKey) => {
    return this.private_getFetchTimes(key);
  }
}

export default RegionPublic;
