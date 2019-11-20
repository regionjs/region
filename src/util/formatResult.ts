import { FormatResultParams, LoadOption, LoadPayload, Id, Params, Payload, SimpleKey, ResultOrFunc } from '../types';

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

interface GetIdParams {
  id: LoadOption['id'];
  params: Params;
}

const getId = ({ id, params }: GetIdParams): Id => {
  if (typeof id === 'function') {
    return id(params);
  }
  // undefined as 'undefined'
  return id as string;
};

interface GetPayloadWithIdParams {
  key: SimpleKey;
  resultOrFunc: ResultOrFunc;
  snapshot: any;
  params: Params;
  option: LoadOption;
}

const getPayloadWithId = ({ key, resultOrFunc, snapshot, params, option }: GetPayloadWithIdParams) => {
  const { format, reducer, id } = option;
  const formatId = getId({ id, params });

  let formatted;
  if (typeof reducer === 'function') {
    formatted = reducer(snapshot, resultOrFunc, params);
  } else {
    formatted = typeof format === 'function' ? format(resultOrFunc, snapshot) : resultOrFunc;
  }
  return { key, id: formatId, result: formatted };
};

interface GetPayloadParams {
  key: SimpleKey;
  result: ResultOrFunc;
  snapshot: any;
  params: Params;
  option: LoadOption;
}

export const getPayload = ({ key, snapshot, result, params, option }: GetPayloadParams): Payload => {
  const { format, reducer, id } = option;

  if (id !== undefined) {
    return getPayloadWithId({ key, resultOrFunc: result, snapshot, params, option });
  }
  const formattedResult = formatResult({ resultOrFunc: result, snapshot, format, reducer, params });
  return { key, result: formattedResult };
};

interface GetLoadPayloadParams {
  key: SimpleKey;
  promise: Promise<any>;
  params: Params;
  option: LoadOption;
}

export const getLoadPayload = ({ key, promise, params, option }: GetLoadPayloadParams): LoadPayload => {
  const { id } = option;
  const formatId = getId({ id, params });
  return { key, promise, id: formatId };
};
