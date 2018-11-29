import { getFetchTimes } from './util/getThingsFromState';
import { expiredTime, setLoading } from './util/config';

const isExpired = (getState, key) => {
  const fetchTime = getFetchTimes(getState(), key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

const groupLog = (title, e) => {
  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed(title);
    console.debug(e);
    console.groupEnd();
  }
};

function formatResult(result, snapshot, key, format) {
  try {
    const formattedResult = format(result, snapshot);
    return formattedResult;
  } catch (e) {
    groupLog(`Catch an error when format ${key}, return null instead.`, e);
    return null;
  }
}

export default async function ({ dispatch, getState, key, Promise, snapshot, forceUpdate, params = {}, format }) {
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

  if (typeof format === 'function') {
    result = formatResult(result, snapshot, key, format);
  }
  return result;
}
