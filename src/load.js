import { getResults as getSnapshot } from './util/region';
import { setLoading, setResult } from './util/constant';
import { isAsync } from './util/isAsync';
import { shouldThrottle } from './util/shouldThrottle';
import { set } from './util/set';
import { getStore, formatResult } from './util/formatResult';

const toPromise = async ({ Promise, params }) => {
  if (typeof Promise === 'function') {
    return Promise(params);
  }
  // promise
  return Promise;
};

/**
 * @param params Promise may need
 * @param format A function format result to other data structure
 * @param forceUpdate true | false
 */
export const load = async (key, Promise, { forceUpdate, params, format } = {}) => {
  if (!isAsync(Promise)) {
    console.warn('set result directly');
    return set(key, Promise);
  }

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
};
