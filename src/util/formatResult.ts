import { FormatResultParams, LoadPayload, Payload } from '../types';

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

const getId = ({ id, params }: any) => {
  if (typeof id === 'function') {
    return id(params);
  }
  return id;
};

const getPayloadWithId = ({ key, resultOrFunc, snapshot, params, option }: any) => {
  const { format, reducer, id } = option;
  const formatId = getId({ id, params });

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

export const getLoadPayload = ({ key, promise, params, option }: any): LoadPayload => {
  const { id } = option;
  const formatId = getId({ id, params });
  return { key, promise, id: formatId };
};
