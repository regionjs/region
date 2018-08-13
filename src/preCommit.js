import { getFetchTimes } from './util/getThingsFromState';
import { expiredTime, setLoading, setResult } from './util/config';

const isExpired = (getState, key) => {
  const fetchTime = getFetchTimes(getState(), key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

function formatResult(result, format, snapshot, key) {
  try {
    const formattedResult = format(result, snapshot);
    return formattedResult;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.groupCollapsed(`Catch an error when format ${key}, return null instead.`);
      console.debug(e);
      console.groupEnd();
    }
    return null;
  }
}

async function promiseCall(dispatch, key, Promise, props, snapshot) {
  let result;
  const { params = {}, format, formatSplit } = props;
  dispatch({ type: setLoading, payload: { key } });
  result = await Promise(params);
  if (typeof format === 'function') {
    result = formatResult(result, format, snapshot, key);
  }
  if (Array.isArray(result) && formatSplit) {
    result.forEach((item, index) => {
      const itemKey = item[formatSplit] || item.id || index;
      dispatch({ type: setResult, payload: { key: `${key}/${itemKey}`, result: item } });
    });
  }
  return result;
}

export default async function (dispatch, getState, key, Promise, snapshot, props) {
  const { forceUpdate = 'need' } = props;

  if (forceUpdate === 'never' && snapshot) {
    return snapshot;
  }
  if (forceUpdate === 'need' && !isExpired(getState, key) && snapshot) {
    return snapshot;
  }
  if (typeof Promise !== 'function') {
    // TODO fire warning if Promise is a promise, it should be a Promise
    console.warn('redux-loadings: function which returns a promise is required. Plain object and non-func Promise works, but it may cause performance problem and bugs');
    return Promise;
  }
  const result = await promiseCall(dispatch, key, Promise, props, snapshot);
  return result;
}
