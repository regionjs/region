import { createActions } from 'redux-actions';
import { getResults, getFetchTimes } from './getThingsFromState';

const FETCH_DATE_CACHE_TIME = 5 * 60 * 1000;

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
  return now - fetchTime > FETCH_DATE_CACHE_TIME;
};

/**
 * @param config.params Promise may need
 * @param config.format A pure function format result to other data structure
 * @param config.forceUpdate 'always' | 'need' | 'never'
 */
export async function asyncLoad(dispatch, getState, key, Promise, config = {}) {
  const { params = {}, format, forceUpdate = 'need' } = config;
  let result;
  // eslint-disable-next-line no-mixed-operators
  if (forceUpdate === 'never' || forceUpdate === 'need' && !isExpired(getState, key)) {
    result = getResults(getState(), key);
    if (result) {
      return result;
    }
  }
  dispatch(setLoading({ key }));
  if (typeof Promise === 'function') {
    result = await Promise(params);
  } else {
    result = Promise;
  }
  if (typeof format === 'function') {
    result = format(result);
  }
  dispatch(setResult({ key, result }));
  return result;
}

export const load = (key, Promise, config) => (dispatch, getState) => {
  asyncLoad(dispatch, getState, key, Promise, config);
};
