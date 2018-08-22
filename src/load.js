import { getResults as getSnapshot } from './util/getThingsFromState';
import preCommit from './preCommit';
import commit from './commit';
import { store } from './util/config';

/**
 * @param props.params Promise may need
 * @param props.format A pure function format result to other data structure
 * @param props.forceUpdate 'always' | 'need' | 'never'
 */
export async function load(key, Promise, props = {}) {
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  const { dispatch, getState } = store;

  const snapshot = getSnapshot(getState(), key);
  const result = await preCommit(dispatch, getState, key, Promise, snapshot, props);
  commit(dispatch, getState, key, result, snapshot, props);
  return result;
}
