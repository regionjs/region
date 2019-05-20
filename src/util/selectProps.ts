import { Key, State, Props, BaseKey, Loading, SelectPropsKey, Results, SelectPropsParams, SimpleKey } from '../types';

const selectLoading = (loadings: Loading[]) => loadings.reduce((a, b) => a || b, false);

const selectError = (errors: Error[]) => {
  const filteredErrors = errors.filter(e => e);
  if (filteredErrors.length > 0) {
    return filteredErrors.map(e => e.message).join(', ');
  }
  return undefined;
};

const selectFetchTime = (fetchTimes: number[]) => {
  const fetchTime = fetchTimes.reduce((a, b) => a > b ? a : b, 0);
  return fetchTime || undefined;
};

const selectResult = (keys: SelectPropsKey, results: Results) => {
  if (Array.isArray(keys)) {
    const props: Props = {};
    keys.forEach((key: string, index: number) => {
      props[key] = results[index];
    });
    return props;
  }
  return { [keys]: results };
};

export const selectProps = ({ keys, loadings, results, fetchTimes, errors }: SelectPropsParams): Props => {
  const loading = Array.isArray(loadings) ? selectLoading(loadings) : loadings;
  const error = Array.isArray(errors) ? selectError(errors) : errors && errors.message ;
  const fetchTime = Array.isArray(fetchTimes) ? selectFetchTime(fetchTimes) : fetchTimes;
  const resultMap = selectResult(keys, results);
  return { loading, fetchTime, error, ...resultMap };
};

export const formatLoading = (loading?: boolean, strictLoading?: boolean) => {
  if (loading) {
    return true;
  }
  if (loading === undefined) {
    if (strictLoading) { // treat undefined as true or as undefined
      return true;
    }
    return undefined;
  }
  return false;
};

const getValue = (state: State, category: string, key: SimpleKey) => {
  const values = state[category] || {};
  return values[key];
};

export const mapValues = (state: State = {}, category: string, key: BaseKey, format = (v: any) => v) => {
  if (Array.isArray(key)) {
    return key.map(i => getValue(state, category, i)).map(format);
  }
  return format(getValue(state, category, key));
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
