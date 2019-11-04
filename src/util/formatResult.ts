import { FormatResultParams, FormatResultWithIdParams } from '../types';

export const formatResult = ({ resultOrFunc, snapshot, format, reducer, params }: FormatResultParams) => {
  if (typeof resultOrFunc === 'function') {
    return resultOrFunc(snapshot);
  }
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, resultOrFunc, params);
    return formatted;
  }
  const formatted = typeof format === 'function' ? format(resultOrFunc, snapshot) : resultOrFunc;
  return formatted;
};

export const formatResultWithId = ({ resultOrFunc, snapshot, format, id, reducer, params }: FormatResultWithIdParams) => {
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, resultOrFunc, params);
    // NOTE should return a different object or useProps may? broke
    return Object.assign({}, snapshot, { [id]: formatted });
  }
  const formatted = typeof format === 'function' ? format(resultOrFunc, snapshot) : resultOrFunc;
  // NOTE should return a different object or useProps may? broke
  return Object.assign({}, snapshot, { [id]: formatted });
};
