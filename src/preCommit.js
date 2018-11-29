import { getFetchTimes } from './util/getThingsFromState';
import { expiredTime, setLoading } from './util/config';

const isExpired = (getState, key) => {
  const fetchTime = getFetchTimes(getState(), key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export default async ({ dispatch, getState, key, Promise, snapshot, forceUpdate, params }) => {
  dispatch({ type: setLoading, payload: { key } });
  let result;
  if (typeof Promise === 'function') {
    if (!forceUpdate && !isExpired(getState, key) && snapshot) {
      return snapshot;
    }
    result = await Promise(params);
  } else { // promise
    result = await Promise;
  }
  return result;
};
