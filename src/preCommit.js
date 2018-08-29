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

async function promiseCall(dispatch, key, Promise, props, snapshot) {
  let result;
  const { params = {}, format } = props;
  dispatch({ type: setLoading, payload: { key } });
  result = await Promise(params);
  if (typeof format === 'function') {
    result = formatResult(result, snapshot, key, format);
  }
  return result;
}

const getForceUpdate = (props) => {
  const { forceUpdate } = props;
  if (typeof forceUpdate === 'string') {
    console.warn('migrate forceUpdate to boolean, forceUpdate === \'never\' is deprecated, use large expireTime if you need \'never\'');
    return forceUpdate === 'always';
  }
  return forceUpdate;
};

export default async function (dispatch, getState, key, Promise, snapshot, props) {
  const forceUpdate = getForceUpdate(props);

  if (!forceUpdate && !isExpired(getState, key) && snapshot) {
    return snapshot;
  }
  if (typeof Promise === 'object' && typeof Promise.then === 'function') {
    console.warn('redux-loadings: You are passing promise, it may cause performance problem and bugs. Pass a function returns a promise instead');
    const result = await Promise;
    return result;
  }
  if (typeof Promise !== 'function') {
    return Promise;
  }
  const result = await promiseCall(dispatch, key, Promise, props, snapshot);
  return result;
}
