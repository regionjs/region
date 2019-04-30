import { Props, Path, Loading, SelectPropsKey, Results, SelectPropsParams } from '../types';

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
  const error = Array.isArray(errors) ? selectError(errors) : errors;
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

type Values = {[key: string]: any};

export const mapValues = (values: Values = {}, path: Path, format = (v: any) => v) => {
  if (Array.isArray(path)) {
    return path.map(i => values[i]).map(format);
  }
  return format(values[path]);
};
