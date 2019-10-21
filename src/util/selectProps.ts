import {
  Key,
  State,
  Props,
  BaseKey,
  Loading,
  Result,
  SimpleKey,
  SimpleKeys,
} from '../types';

export const selectLoading = (loadings: Loading[]) => loadings.reduce((a, b) => a || b, false);

export const selectError = (errors: Error[]) => {
  const filteredErrors = errors.filter(e => e);
  if (filteredErrors.length > 0) {
    const errorMessage = filteredErrors.map(e => e.message).join(', ');
    return new Error(errorMessage);
  }
  return undefined;
};

export const selectFetchTime = (fetchTimes: number[]) => {
  const fetchTime = fetchTimes.reduce((a, b) => a > b ? a : b, 0);
  return fetchTime || undefined;
};

export const selectResult = (keys: SimpleKeys, results: Result[]) => {
  const props: Props = {};
  keys.forEach((key: string, index: number) => {
    props[key] = results[index];
  });
  return props;
};

export const formatLoading = (loading?: boolean) => {
  // treat undefined as true
  return loading || loading === undefined;
};

const getValue = (state: State, key: SimpleKey) => {
  const values = state[key] || {};
  return values;
};

export const mapValues = (state: State = {}, key: BaseKey, format = (v: any) => v) => {
  if (Array.isArray(key)) {
    return key.map(i => getValue(state, i)).map(format);
  }
  return format(getValue(state, key));
};

export const formatKeys = (key: Key) => {
  if (typeof key === 'string') {
    return {
      keys: [key],
      loadings: [key],
      results: [key],
      fetchTimes: [key],
      errors: [key],
    };
  }
  if (Array.isArray(key)) {
    return {
      keys: key,
      loadings: key,
      results: key,
      fetchTimes: key,
      errors: key,
    };
  }
  let keys = key.result || key.key || [];
  let loadings = key.loading || key.key || [];
  let results = key.result || key.key || [];
  let fetchTimes = key.fetchTime || key.key || [];
  let errors = key.error || key.key || [];
  keys = Array.isArray(keys) ? keys : [keys];
  loadings = Array.isArray(loadings) ? loadings : [loadings];
  results = Array.isArray(results) ? results : [results];
  fetchTimes = Array.isArray(fetchTimes) ? fetchTimes : [fetchTimes];
  errors = Array.isArray(errors) ? errors : [errors];
  return { keys, loadings, results, fetchTimes, errors };
};
