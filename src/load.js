import { createActions } from 'redux-actions';
import { getResults, getFetchTimes } from './util/getThingsFromState';
import config from './util/config';

const { expiredTime } = config;

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
 * @param props.params Promise may need
 * @param props.format A pure function format result to other data structure
 * @param props.forceUpdate 'always' | 'need' | 'never'
 */
export async function asyncLoad(dispatch, getState, key, Promise, props = {}) {
  if (typeof dispatch !== 'function' || typeof getState !== 'function') {
    throw Error('dispatch and getState is required when you use asyncLoad()');
  }

  const { params = {}, forceUpdate = 'need', format, willSetResult, didSetResult } = props;
  const snapshot = getResults(getState(), key);

  let result;
  if (forceUpdate === 'never' && snapshot) { // eslint-disable-line no-mixed-operators
    result = snapshot;
  } else if (forceUpdate === 'need' && !isExpired(getState, key) && snapshot) {
    result = snapshot;
  } else if (typeof Promise !== 'function') {
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

export const load = (key, Promise, props) => (dispatch, getState) => {
  asyncLoad(dispatch, getState, key, Promise, props);
};
