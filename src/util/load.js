import { getResults as getSnapshot } from './region';
import { setLoading, setResult } from './constant';
import { isAsync } from './isAsync';
import { shouldThrottle } from './shouldThrottle';
import { set } from './set';
import { getStore, formatResult } from './formatResult';

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
