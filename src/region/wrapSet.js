import { formatResult } from '../util/formatResult';
import { getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    /**
     * @param format A function format result to other data structure
     */
    set = (key, result, { format } = {}) => {
      const { getResults: getSnapshot, private_actionTypes } = this;
      const { LOAD_START, LOAD_END, SET } = private_actionTypes;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);

      const formattedResult = formatResult({ result, snapshot, key, format });
      // TODO 需要重置 loading 为 undefined 的情况
      dispatch({ type: LOAD_START, payload: { key } });
      dispatch({ type: LOAD_END, payload: { key } });
      dispatch({ type: SET, payload: { key, result: formattedResult } });
      return formattedResult;
    }
  }
  return Region;
};
