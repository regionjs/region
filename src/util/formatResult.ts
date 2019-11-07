import { FormatResultParams, Payload } from '../types';

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

export const getPayloadWithId = ({ key, resultOrFunc, snapshot, params, option }: any) => {
  const { format, reducer, id } = option;
  let formatId;
  if (typeof id === 'function') {
    formatId = id(params);
  } else {
    formatId = id;
  }

  let formatted;
  if (typeof reducer === 'function') {
    formatted = reducer(snapshot, resultOrFunc, params);
  } else {
    formatted = typeof format === 'function' ? format(resultOrFunc, snapshot) : resultOrFunc;
  }
  // NOTE should return a different object or useProps may? broke
  const formattedResult = Object.assign({}, snapshot, { [formatId]: formatted });
  return { key, results: formattedResult, id: formatId, result: formatted };
};

export const getPayload = ({ key, snapshot, result, params, option }: any): Payload => {
  const { format, reducer, id } = option;

  if (id !== undefined) {
    return getPayloadWithId({ key, resultOrFunc: result, snapshot, format, id, reducer, params, option });
  }
  const formattedResult = formatResult({ resultOrFunc: result, snapshot, format, reducer, params });
  return { key, result: formattedResult };
};
