import { formatResult } from '../util/formatResult';
import { getStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.set = this.set.bind(this);
    }

    /**
     * @param format A function format result to other data structure
     */
    set(key, result, { format } = {}) {
      const { getResults: getSnapshot, SET_RESULT } = this;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);

      const formattedResult = formatResult({ result, snapshot, key, format });
      dispatch({ type: SET_RESULT, payload: { key, result: formattedResult } });
      return formattedResult;
    }
  }
  return Region;
};
