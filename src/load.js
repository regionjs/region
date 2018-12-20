import preCommit from './preCommit';
import { region, getResults as getSnapshot } from './util/region';
import { setResult } from './util/constant';
import { groupWarn } from './util/logger';

const getStore = () => {
  const { store } = region;
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  return store;
};

const isAsync = (Promise) => {
  if (Promise && typeof Promise === 'object' && typeof Promise.then === 'function') {
    return true;
  }
  return typeof Promise === 'function';
};

const formatResult = (result, snapshot, key, format) => {
  if (typeof format !== 'function') {
    return result;
  }
  try {
    const formattedResult = format(result, snapshot);
    return formattedResult;
  } catch (e) {
    groupWarn(`Catch an error when format ${key}, return null instead.`, e);
    return null;
  }
};

/**
 * @param format A function format result to other data structure
 */
export const set = (key, result, { format } = {}) => {
  const { dispatch } = getStore();
  const snapshot = getSnapshot(key);

  const formattedResult = formatResult(result, snapshot, key, format);
  dispatch({ type: setResult, payload: { key, result: formattedResult } });
  return formattedResult;
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

  const { dispatch, getState } = getStore();
  const snapshot = getSnapshot(key);
  const result = await preCommit({ dispatch, getState, key, Promise, snapshot, forceUpdate, params });

  const formattedResult = formatResult(result, snapshot, key, format);
  dispatch({ type: setResult, payload: { key, result: formattedResult } });
  return formattedResult;
};
