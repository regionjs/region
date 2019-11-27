import {
  LegacyKey,
  State,
  AnyObject,
  Key,
  Loading,
  FetchTime,
  Result,
  SimpleKey,
  SimpleKeys,
} from '../types';

export const selectLoading = (loadings: Loading[]) => loadings.reduce((a, b) => a || b, false);

export const selectError = (errors: Error[]) => {
  const filteredErrors = errors.filter(e => e);
  if (filteredErrors.length > 0) {
    // e, as agreed, should be Error. but when it isn't, return e as string
    const errorMessage = filteredErrors.map(e => typeof e === 'string' ? e : e.message).join(', ');
    return new Error(errorMessage);
  }
  return undefined;
};

export const selectFetchTime = (fetchTimes: FetchTime[]) => {
  const fetchTime = fetchTimes.reduce(
    (a, b) => {
      if (a === undefined) {
        return b;
      }
      if (b === undefined) {
        return a;
      }
      return a > b ? a : b;
    },
    undefined,
  );
  return fetchTime;
};

export const selectResult = (keys: SimpleKeys, results: Result[]) => {
  const props: AnyObject = {};
  keys.forEach((key: string, index: number) => {
    props[key] = results[index];
  });
  return props;
};

export const formatLoading = (loading?: number) => {
  // treat undefined as true
  if (loading === undefined) {
    return true;
  }
  return loading > 0;
};

const getValue = (state: State, key: SimpleKey) => {
  const values = state[key] || {};
  return values;
};

export const mapValues = (state: State = {}, key: Key, format = (v: any) => v) => {
  if (Array.isArray(key)) {
    return key.map(i => getValue(state, i)).map(format);
  }
  return format(getValue(state, key));
};

export const formatKeys = (key: LegacyKey) => {
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
