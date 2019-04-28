import { formatResult } from '../util/formatResult';
import * as shallowEqual from 'shallowequal';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { EntityName, Result, AsyncFunction, Params, Key } from '../types/types';
import { LoadOption, Props } from '../types/interfaces';
import RegionPrivate from './RegionPrivate';
import { selectProps } from '../util/selectProps';

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
      if (shouldThrottle({ asyncFunction, forceUpdate, key, snapshot, id, expiredTime, getFetchTimes })) {
        return snapshot;
      }
      dispatch({ type: LOAD, payload: { key } });
      try {
        const result = await toPromise({ asyncFunction, params });
        const formattedResult = formatResult({ result, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult } });
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

  unstable_effect = (from: Key, to: EntityName, getDerivedStateFromProps: any) => {
    const { private_store, private_actionTypes, getProps, private_getResults, set, load } = this;
    const { SET, LOAD } = private_actionTypes;
    const { dispatch } = private_store;
    let props: Props = {};
    const handleSubscribe = () => {
      const nextProps = getProps(from);

      // NOTE it is a recurse, assign props before dispatch
      // something begin to load
      if (props.loading === false && nextProps.loading === true) {
        props = nextProps;
        dispatch({ type: LOAD, payload: { key: to } });
        return;
      }

      // something resolved
      if (nextProps.loading === false && !shallowEqual(props, nextProps)) {
        props = nextProps;
        const snapshot = private_getResults(to);
        const result = getDerivedStateFromProps(props, snapshot);
        if (!isAsync(result)) {
          set(to, result);
          return;
        }
        load(to, result);
      }
    };
    handleSubscribe();
    private_store.subscribe(handleSubscribe);
  }
}

export default RegionPublic;
