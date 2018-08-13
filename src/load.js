import { getResults as getSnapshot } from './util/getThingsFromState';
import preCommit from './preCommit';
import commit from './commit';

/**
 * @param props.params Promise may need
 * @param props.format A pure function format result to other data structure
 * @param props.forceUpdate 'always' | 'need' | 'never'
 */
export async function asyncLoad(dispatch, getState, key, Promise, props = {}) {
  if (typeof dispatch !== 'function' || typeof getState !== 'function') {
    throw Error('dispatch and getState is required when you use asyncLoad()');
  }

  const snapshot = getSnapshot(getState(), key);
  const result = await preCommit(dispatch, getState, key, Promise, snapshot, props);
  commit(dispatch, getState, key, result, snapshot, props);
  return result;
}

export const load = (key, Promise, props) => (dispatch, getState) => {
  asyncLoad(dispatch, getState, key, Promise, props);
};
