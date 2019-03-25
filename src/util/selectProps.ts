import { Props } from '../types/types';

type SelectPropsKey = string | string[];
// loading === undefined occurs when strictLoading === false
type Loading = boolean | undefined;

export default (keys: SelectPropsKey, loading: Loading, results: any, error: any): object => {
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
