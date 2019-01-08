import { formatResult } from '../util/formatResult';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { getStore } from '../global/store';

const toPromise = async ({ Promise, params }) => {
  if (typeof Promise === 'function') {
    return Promise(params);
  }
  // promise
  return Promise;
};

export default (RegionIn) => {
  class Region extends RegionIn {
    /**
     * @param params Promise may need
     * @param format A function format result to other data structure
     * @param forceUpdate true | false
     */
    load = async (key, Promise, { forceUpdate, params, format } = {}) => {
      if (!isAsync(Promise)) {
        console.warn('set result directly');
        const { set } = this;
        return set(key, Promise);
      }

      const { getResults: getSnapshot, private_actionTypes } = this;
      const { LOAD_START, SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);
      if (shouldThrottle({ Promise, forceUpdate, key, snapshot, region: this })) {
        return snapshot;
      }

      dispatch({ type: LOAD_START, payload: { key } });
      try {
        const result = await toPromise({ Promise, params });
        const formattedResult = formatResult({ result, snapshot, format });
        dispatch({ type: SET, payload: { key, result: formattedResult, withLoadEnd: true } });
        return formattedResult;
      } catch (error) {
        dispatch({ type: SET, payload: { key, result: null, error, withLoadEnd: true } });
        return null;
      }
    }
  }
  return Region;
};
