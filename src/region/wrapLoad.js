import { formatResult } from '../util/formatResult';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';
import { getStore } from '../global/store';
import { groupError } from '../util/logger';

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
      const { LOAD_START, LOAD_END, SET, ERROR } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);
      if (shouldThrottle({ Promise, forceUpdate, key, snapshot, region: this })) {
        return snapshot;
      }
      dispatch({ type: LOAD_START, payload: { key } });
      try {
        const result = await toPromise({ Promise, params });

        const formattedResult = formatResult({ result, snapshot, key, format });
        dispatch({ type: LOAD_END, payload: { key } });
        dispatch({ type: SET, payload: { key, result: formattedResult } });
        return formattedResult;
      } catch (error) {
        groupError(`Catch an error when load ${key}, return null instead.`, error);
        dispatch({ type: LOAD_END, payload: { key } });
        dispatch({ type: ERROR, payload: { key, error } });
        return null;
      }
    }
  }
  return Region;
};
