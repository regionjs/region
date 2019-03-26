import { formatResult } from '../util/formatResult';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { getStore } from '../global/store';
import { EntityName, Result, AsyncFunction, Params } from '../types/types';
import { LoadOptions } from '../types/interfaces';
import RegionPrivate from './RegionPrivate';

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
  set = (key: EntityName, result: Result, option?: LoadOptions) => {
    const { setBy } = this;
    return setBy(key, option)(result);
  }

  /**
   * @param format A function format result to other data structure
   */
  setBy = (key: EntityName, { format }: LoadOptions = {}) => {
    const { private_getResults: getResults, private_actionTypes } = this;
    const { SET } = private_actionTypes;
    const { dispatch } = getStore();
    const snapshot = getResults(key);
    // TODO optimize setBy
    return (result: Result) => {
      const formattedResult = formatResult({ result, snapshot, format });
      dispatch({ type: SET, payload: { key, result: formattedResult } });
      return formattedResult;
    };
  }

  reset = () => {
    const { private_actionTypes } = this;
    const { RESET } = private_actionTypes;
    const { dispatch } = getStore();
    dispatch({ type: RESET });
  }

  load = async (key: EntityName, asyncFunction: AsyncFunction, option: LoadOptions = {}) => {
    if (!isAsync(asyncFunction)) {
      console.warn('set result directly');
      const { set } = this;
      return set(key, asyncFunction, option);
    }
    const { loadBy } = this;
    return loadBy(key, asyncFunction, option)(option.params);
  }

  /**
   * @param params asyncFunction may need
   * @param format A function format result to other data structure
   * @param forceUpdate true | false
   */
  loadBy = (key: EntityName, asyncFunction: AsyncFunction, option: LoadOptions = {}) => {
    const { forceUpdate, params: defaultParams, format, id } = option;
    const { private_getResults: getResults, private_actionTypes, expiredTime, private_getFetchTimes: getFetchTimes } = this;
    const { LOAD, SET } = private_actionTypes;
    const { dispatch } = getStore();
    const snapshot = getResults(key);
    // TODO optimize loadBy
    return async (params: Params) => {
      // tslint:disable-next-line: no-parameter-reassignment TODO remove it
      params = Object.assign({}, defaultParams, params);
      if (shouldThrottle({ asyncFunction, forceUpdate, key, snapshot, id, expiredTime, getFetchTimes })) {
        return snapshot;
      }
      dispatch({ type: LOAD, payload: { key } });
      try {
        const result = await toPromise({ asyncFunction, params });
        const formattedResult = formatResult({ result, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult, withLoadEnd: true } });
        return formattedResult;
      } catch (error) {
        const formattedResult = formatResult({ error, snapshot, format, id });
        dispatch({ type: SET, payload: { key, result: formattedResult, error, withLoadEnd: true } });
        return formattedResult;
      }
    };
  }
}

export default RegionPublic;
