import { getResults as getSnapshot } from '../util/region';
import { formatResult } from '../util/formatResult';
import { setLoading, setResult } from '../util/constant';
import { isAsync } from '../util/isAsync';
import { shouldThrottle } from '../util/shouldThrottle';

const toPromise = async ({ Promise, params }) => {
  if (typeof Promise === 'function') {
    return Promise(params);
  }
  // promise
  return Promise;
};

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.load = this.load.bind(this);
    }

    /**
     * @param params Promise may need
     * @param format A function format result to other data structure
     * @param forceUpdate true | false
     */
    async load(key, Promise, { forceUpdate, params, format } = {}) {
      if (!isAsync(Promise)) {
        console.warn('set result directly');
        const { set } = this;
        return set(key, Promise);
      }

      const { getStore } = this;
      const { dispatch } = getStore();
      const snapshot = getSnapshot(key);
      if (shouldThrottle({ Promise, forceUpdate, key, snapshot })) {
        return snapshot;
      }
      dispatch({ type: setLoading, payload: { key } });
      const result = await toPromise({ Promise, params });

      const formattedResult = formatResult(result, snapshot, key, format);
      dispatch({ type: setResult, payload: { key, result: formattedResult } });
      return formattedResult;
    }
  }
  return Region;
};
