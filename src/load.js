import { createActions } from 'redux-actions';
import { getResults, getFetchTimes } from './util/getThingsFromState';

let expiredTime = 5 * 60 * 1000;

export const setExpiredTime = (value = 5 * 60 * 1000) => {
  expiredTime = value;
};

// FIXME
const {
  setLoading,
  setResult,
} = createActions(
  'SET_LOADING',
  'SET_RESULT',
);

const isExpired = (getState, key) => {
  const fetchTime = getFetchTimes(getState(), key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

/**
 * @param config.params Promise may need
 * @param config.format A pure function format result to other data structure
 * @param config.forceUpdate 'always' | 'need' | 'never'
 */
export async function asyncLoad(dispatch, getState, key, Promise, config = {}) {
  if (typeof dispatch !== 'function' || typeof getState !== 'function') {
    throw Error('dispatch and getState is required when you use asyncLoad()');
  }

  const { params = {}, forceUpdate = 'need', format, willSetResult, didSetResult } = config;
  const snapshot = getResults(getState(), key);

  let result;
  if (forceUpdate === 'never' && snapshot) { // eslint-disable-line no-mixed-operators
    result = snapshot;
  } else if(forceUpdate === 'need' && !isExpired(getState, key) && snapshot) {
    result = snapshot
  } else if(typeof Promise !== 'function'){
    // TODO fire warning
    result = Promise;
  } else {
    dispatch(setLoading({ key }));
    result = await Promise(params);
    if (typeof format === 'function') {
      result = format(result, snapshot);
    }
  }

  if (typeof willSetResult === 'function') {
    willSetResult({ dispatch, getState, result, snapshot });
  }

  dispatch(setResult({ key, result }));

  if (typeof didSetResult === 'function') {
    didSetResult({ dispatch, getState, result, snapshot });
  }
  return result;
}

export const load = (key, Promise, config) => (dispatch, getState) => {
  asyncLoad(dispatch, getState, key, Promise, config);
};
