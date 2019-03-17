import { formatResult } from '../util/formatResult';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { getStore } from '../global/store';

const toPromise = async ({ asyncFunction, params }) => {
  if (typeof asyncFunction === 'function') {
    return asyncFunction(params);
  }
  // promise
  return asyncFunction;
};

export default (Region) => {
  class RegionPublic extends Region {
    set = (key, result, option) => {
      const { setFp } = this;
      return setFp(key, option)(result);
    }

    /**
     * @param format A function format result to other data structure
     */
    setFp = (key, { format } = {}) => {
      const { private_getResults: getResults, private_actionTypes } = this;
      const { SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getResults(key);
      // TODO optimize setFp
      return (result) => {
        const formattedResult = formatResult({ result, snapshot, key, format });
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

    load = async (key, asyncFunction, option = {}) => {
      if (!isAsync(asyncFunction)) {
        console.warn('set result directly');
        const { set } = this;
        return set(key, asyncFunction, option);
      }
      const { loadFp } = this;
      return loadFp(key, asyncFunction, option)(option.params);
    }

    /**
     * @param params asyncFunction may need
     * @param format A function format result to other data structure
     * @param forceUpdate true | false
     */
    loadFp = (key, asyncFunction, option = {}) => {
      const { forceUpdate, params: defaultParams, format, id } = option;
      const { private_getResults: getResults, private_actionTypes, expiredTime, private_getFetchTimes: getFetchTimes } = this;
      const { LOAD, SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getResults(key);
      // TODO optimize loadFp
      return async (params) => {
        // eslint-disable-next-line no-param-reassign, TODO remove it
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
  return RegionPublic;
};
