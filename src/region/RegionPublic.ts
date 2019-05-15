import * as shallowEqual from 'shallowequal';
import RegionPrivate from './RegionPrivate';
import { formatResult, shouldThrottle, isAsync, selectProps, deprecate } from '../util';
import { Props, EntityName, Result, AsyncFunction, Params, Key, GetDerivedStateFromProps, LoadOption } from '../types';

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
    const { format } = option;
    const { private_store, private_getResults: getResults, private_actionTypes } = this;
    const { SET } = private_actionTypes;
    const { dispatch } = private_store;
    const snapshot = getResults(key);
    // TODO optimize setBy
    return (result: Result) => {
      const formattedResult = formatResult({ result, snapshot, format });
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

  load = async (key: EntityName, asyncFunction: AsyncFunction, option: LoadOption = {}) => {
    if (!isAsync(asyncFunction)) {
      console.warn('set result directly');
      const { set } = this;
      return set(key, asyncFunction, option);
    }
    const { loadBy } = this;
    return loadBy(key, asyncFunction, option)(option.params);
  }

  /**
   * @param option.params asyncFunction may need
   * @param option.format A function format result to other data structure
   * @param option.forceUpdate true | false
   */
  loadBy = (key: EntityName, asyncFunction: AsyncFunction, option: LoadOption = {}) => {
    const { forceUpdate, format, id } = option;
    const { private_store, private_getResults: getResults, private_actionTypes, expiredTime, private_getFetchTimes: getFetchTimes } = this;
    const { LOAD, SET } = private_actionTypes;
    const { dispatch } = private_store;
    const snapshot = getResults(key);
    // TODO optimize loadBy
    return async (params: Params) => {
      if (shouldThrottle({ asyncFunction, forceUpdate, key, snapshot, expiredTime, getFetchTimes })) {
        deprecate('Snapshot inject is deprecated. If you do not want it load, you can simply not load it. You can get fetchTime in getProps method to control your load function.'); // tslint:disable max-line-length
        return snapshot;
      }
      dispatch({ type: LOAD, payload: { key } });
      try {
        const result = await toPromise({ asyncFunction, params });
        const formattedResult = formatResult({ result, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult } });
        if (id !== undefined) {
          // TODO TEST ME
          return formattedResult[id];
        }
        return formattedResult;
      } catch (error) {
        dispatch({ type: SET, payload: { key, result: undefined, error } });
        return undefined;
      }
    };
  }

  getProps = (key: Key) => {
    const {
      private_getLoadings: getLoadings,
      private_getResults: getResults,
      private_getFetchTimes: getFetchTimes,
      private_getErrors: getErrors,
    } = this;
    if (typeof key === 'string' || Array.isArray(key)) {
      return selectProps({
        keys: key,
        loadings: getLoadings(key),
        results: getResults(key),
        fetchTimes: getFetchTimes(key),
        errors: getErrors(key),
      });
    }
    return selectProps({
      keys: key.result || key.key || [],
      loadings: getLoadings(key.loading || key.key || []),
      results: getResults(key.result || key.key || []),
      fetchTimes: getFetchTimes(key.fetchTime || key.key || []),
      errors: getErrors(key.error || key.key || []),
    });
  }

  unstable_effect = (from: Key, to: EntityName, getDerivedStateFromProps: GetDerivedStateFromProps) => {
    const { private_store, private_actionTypes, getProps, private_getResults, load } = this;
    const { SET, LOAD } = private_actionTypes;
    const { dispatch } = private_store;
    let props: Props = {};
    const handleSubscribe = () => {
      const nextProps = getProps(from);
      if (shallowEqual(props, nextProps)) {
        return;
      }
      const prevLoading = props.loading;
      props = nextProps;
      const { loading, error } = props;
      // NOTE it is a recurse, assign props before dispatch
      // something begin to load
      if (prevLoading === false && loading === true) {
        // set a snapshot first otherwise effect is outdated, this should be think as optimistic-ui
        // TODO optimize code & add cases
        try {
          const snapshot = private_getResults(to);
          const result = getDerivedStateFromProps(props, snapshot);
          if (!isAsync(result)) {
            dispatch({ type: SET, payload: { key: to, result } });
          }
        } catch (error) {
          dispatch({ type: SET, payload: { key: to, result: undefined, error } });
        }
        // NOTE LOAD after SET
        dispatch({ type: LOAD, payload: { key: to } });
        return;
      }

      // something went error
      if (error) {
        dispatch({ type: SET, payload: { key: to, result: undefined, error: new Error(error) } });
        return;
      }

      // something resolved
      if (loading === false) {
        const snapshot = private_getResults(to);
        try {
          const result = getDerivedStateFromProps(props, snapshot);
          if (!isAsync(result)) {
            dispatch({ type: SET, payload: { key: to, result } });
            return;
          }
          load(to, result);
        } catch (error) {
          dispatch({ type: SET, payload: { key: to, result: undefined, error } });
        }
      }
    };
    handleSubscribe();
    private_store.subscribe(handleSubscribe);
  }
}

export default RegionPublic;
