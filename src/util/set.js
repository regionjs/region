import { getResults as getSnapshot } from './region';
import { setResult } from './constant';
import { getStore, formatResult } from './formatResult';

/**
 * @param format A function format result to other data structure
 */
export const set = (key, result, { format } = {}) => {
  const { dispatch } = getStore();
  const snapshot = getSnapshot(key);

  const formattedResult = formatResult({ result, snapshot, key, format });
  dispatch({ type: setResult, payload: { key, result: formattedResult } });
  return formattedResult;
};
