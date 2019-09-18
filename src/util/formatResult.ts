import { FormatResultParams, FormatResultWithIdParams } from '../types';

export const formatResult = ({ result, snapshot, format, reducer, params }: FormatResultParams) => {
  if (typeof result === 'function') {
    return result(snapshot);
  }
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, result, params);
    return formatted;
  }
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  return formatted;
};

export const formatResultWithId = ({ result, snapshot, format, id, reducer, params }: FormatResultWithIdParams) => {
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, result, params);
    // NOTE should return a different object or useProps may? broke
    return Object.assign({}, snapshot, { [id]: formatted });
  }
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  // NOTE should return a different object or useProps may? broke
  return Object.assign({}, snapshot, { [id]: formatted });
};
