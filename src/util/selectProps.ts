import { Props } from '../types/interfaces';
import { Path } from '../types/types';

type SelectPropsKey = string | string[];
// loading === undefined occurs when strictLoading === false
type Loading = boolean | undefined;

export const selectProps = (keys: SelectPropsKey, loading: Loading, results: any, error: any): Props => {
  // TODO migrate selectProps
  // 可以在这里做更多的事情，把合并的过程放在这里，因为 getFunctions 已经是 private 的了，这样就不用考虑【是否要把 error: '' 给用户】
  // 同时可以把 fetchTime 放在这里
  // 但是为了用户友好，在下个大版本做这个
  if (typeof keys === 'string') {
    const props = { loading, error, [keys]: results };
    return props;
  }
  const props: Props = { loading, error };
  keys.forEach((key: string, index: number) => {
    props[key] = results[index];
  });
  return props;
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

export const mapValues = (values: Values, path: Path) => {
  if (Array.isArray(path)) {
    return path.map(i => values[i]);
  }
  return values[path];
};
