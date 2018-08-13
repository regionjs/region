import { setResult } from './util/config';

export default function (dispatch, getState, key, result, snapshot, props) {
  const { willSetResult, didSetResult } = props;
  if (typeof willSetResult === 'function') {
    willSetResult({ dispatch, getState, result, snapshot });
  }

  dispatch({ type: setResult, payload: { key, result } });

  if (typeof didSetResult === 'function') {
    didSetResult({ dispatch, getState, result, snapshot });
  }
}
