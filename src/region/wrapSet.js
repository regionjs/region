import { formatResult } from '../util/formatResult';
import { getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    /**
     * @param format A function format result to other data structure
     */
    set = (key, result, { format } = {}) => {
      const { getResults: getSnapshot, private_actionTypes } = this;
      const { SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);

      try {
        const formattedResult = formatResult({ result, snapshot, key, format });
        dispatch({ type: SET, payload: { key, result: formattedResult } });
        return formattedResult;
      } catch (error) {
        dispatch({ type: SET, payload: { key, result: null, error } });
        return null;
      }
    }
  }
  return Region;
};
