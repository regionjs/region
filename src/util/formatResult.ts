import {
  LoadOption,
  LoadPayload,
  Id,
  IdFunc,
  Payload,
} from '../types';

const formatResult = ({ snapshot, result, params, option }: any) => {
  const { format, reducer } = option;
  if (typeof result === 'function') {
    // never
    return (result as any)(snapshot);
  }
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, result, params);
    return formatted;
  }
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  return formatted;
};

interface GetIdParams<TParams> {
  id: Id | IdFunc<TParams> | undefined;
  params: TParams;
}

export const selectId = <TParams>({ id, params }: GetIdParams<TParams>): Id => {
  if (typeof id === 'function') {
    return id(params);
  }
  // undefined as 'undefined'
  return id as string;
};

interface GetPayloadParams<T, K extends keyof T, TParams, TResult> {
  key: K;
  result: TResult;
  snapshot?: T[K];
  params: TParams;
  option: LoadOption<TParams, TResult, T[K]>;
}

export const selectPayload = <T, K extends keyof T, TParams, TResult>(
  { key, snapshot, result, params, option }: GetPayloadParams<T, K, TParams, TResult>,
): Payload<T, K> => {
  const { id } = option;

  if (id !== undefined) {

    const { id, reducer, format } = option;
    const formatId = selectId({ id, params });

    const formattedResult = typeof reducer === 'function'
      ? reducer(snapshot, result, params)
      : (
        typeof format === 'function'
          ? format(result, snapshot)
          : (result as unknown as T[K])
      );
    return { key, id: formatId, result: formattedResult };
  }
  const formattedResult = formatResult({ snapshot, result, params, option });
  return { key, result: formattedResult };
};
