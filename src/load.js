import { getResults as getSnapshot } from './util/getThingsFromState';
import preCommit from './preCommit';
import { setResult, store } from './util/config';

const getStore = () => {
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

export function set(key, result) {
  const { dispatch } = getStore();
  dispatch({ type: setResult, payload: { key, result } });
  return result;
}

/**
 * @param props.params Promise may need
 * @param props.format A pure function format result to other data structure
 * @param props.forceUpdate true | false
 */
export async function load(key, Promise, props = {}) {
  if (!isAsync(Promise)) {
    console.warn('set result directly');
    return set(key, Promise);
  }

  const { dispatch, getState } = getStore();
  const snapshot = getSnapshot(key);
  const result = await preCommit({ dispatch, getState, key, Promise, snapshot, ...props });
  dispatch({ type: setResult, payload: { key, result } });
  return result;
}
