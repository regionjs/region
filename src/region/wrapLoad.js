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

      const { getResults: getSnapshot, SET_LOADING, SET_RESULT } = this;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);
      if (shouldThrottle({ Promise, forceUpdate, key, snapshot, region: this })) {
        return snapshot;
      }
      dispatch({ type: SET_LOADING, payload: { key } });
      const result = await toPromise({ Promise, params });

      const formattedResult = formatResult({ result, snapshot, key, format });
      dispatch({ type: SET_RESULT, payload: { key, result: formattedResult } });
      return formattedResult;
    }
  }
  return Region;
};
