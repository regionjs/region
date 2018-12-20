import { setLoading } from './util/constant';
import { shouldThrottle } from './util/shouldThrottle';

export default async ({ dispatch, key, Promise, snapshot, forceUpdate, params }) => {
  dispatch({ type: setLoading, payload: { key } });
  let result;
  if (typeof Promise === 'function') {
    if (shouldThrottle({ forceUpdate, key, snapshot })) {
      return snapshot;
    }
    result = await Promise(params);
  } else { // promise
    result = await Promise;
  }
  return result;
};
