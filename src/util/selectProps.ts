import { LegacyKey } from '../types';

type Loading = number | undefined;

const formatLoading = (loading?: number) => {
  // treat undefined as true
  if (loading === undefined) {
    return true;
  }
  return loading > 0;
};

export const selectLoading = (loadings: Loading[]) => loadings.reduce(
  (a, b) => {
    const currentLoading = formatLoading(b);
    return a || currentLoading;
  },
  false,
);

export const selectError = (errors: Error[]) => {
  const filteredErrors = errors.filter(e => e);

  if (filteredErrors.length === 1) {
    const e = errors[0];
    return typeof e === 'string' ? new Error(e) : e;
  }

  if (filteredErrors.length > 1) {
    console.warn('select multiple error may cause problems.');
    // e, as agreed, should be Error. but when it isn't, return e as string
    const errorMessage = filteredErrors.map(e => typeof e === 'string' ? e : e.message).join(', ');
    return new Error(errorMessage);
  }
  return undefined;
};

export const selectFetchTime = (fetchTimes: (number | undefined)[]) => {
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

type K = keyof any;

export const selectResult = (keys: K[], results: any[]) => {
  const props: any = {};
  keys.forEach((key, index) => {
    props[key] = results[index];
  });
  return props;
};

export const formatLegacyKeys = <K>(key: LegacyKey<K>): any => {
  if (Array.isArray(key)) {
    return {
      keys: key,
      loadings: key,
      results: key,
      fetchTimes: key,
      errors: key,
    };
  }
  return {
    keys: [key],
    loadings: [key],
    results: [key],
    fetchTimes: [key],
    errors: [key],
  };
};
