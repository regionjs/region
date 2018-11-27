import { getResults as getSnapshot } from './util/getThingsFromState';
import preCommit from './preCommit';
import { setResult, store } from './util/config';

/**
 * @param props.params Promise may need
 * @param props.format A pure function format result to other data structure
 * @param props.forceUpdate true | false
 */
export async function load(key, Promise, props = {}) {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  const { dispatch, getState } = store;

  const snapshot = getSnapshot(key);
  const result = await preCommit(dispatch, getState, key, Promise, snapshot, props);
  dispatch({ type: setResult, payload: { key, result } });
  return result;
}

export async function set(key, result) {
  await load(key, result, { forceUpdate: true });
}
