import { LoadOption } from '../types';

interface FormatResultParams<V, TParams, TResult> {
  result: TResult;
  snapshot?: V;
  params: TParams;
  option: LoadOption<TParams, TResult, V>;
}

export const formatResult = <V, TParams, TResult>({ snapshot, result, params, option }: FormatResultParams<V, TParams, TResult>) => {
  const { reducer } = option;
  if (typeof result === 'function') {
    // never
    return (result as any)(snapshot, result, params);
  }
  if (typeof reducer === 'function') {
    const formatted = reducer(snapshot, result, params);
    return formatted;
  }
  return result;
};

interface GetPayloadParams<K, V, TParams, TResult> {
  key: K;
  result: TResult;
  snapshot?: V;
  params: TParams;
  option: LoadOption<TParams, TResult, V>;
}

export const selectPayload = <K, V, TParams, TResult>(
  { key, snapshot, result, params, option }: GetPayloadParams<K, V, TParams, TResult>,
) => {
  const formattedResult = formatResult({ snapshot, result, params, option });
  return { key, result: formattedResult };
};
