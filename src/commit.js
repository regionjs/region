import { setResult } from './util/config';

export default function (dispatch, getState, key, result, snapshot, props) {
  const { willSetResult, didSetResult } = props;
  if (typeof willSetResult === 'function') {
    console.warn('willSetResult is deprecated, you can use format instead, issue me if there is migrate problem');
    willSetResult({ dispatch, getState, result, snapshot });
  }

  dispatch({ type: setResult, payload: { key, result } });

  if (typeof didSetResult === 'function') {
    console.warn('didSetResult is deprecated, you can use const result = await load();');
    didSetResult({ dispatch, getState, result, snapshot });
  }
}
