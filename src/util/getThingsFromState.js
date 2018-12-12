import { reducerPath, store, strictLoading } from './config';

const getReducerState = () => {
  const state = store.getState();
  if (reducerPath === null) {
    return state || {};
  }
  return state[reducerPath] || {};
};

const formatLoading = (loading) => {
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

export const getLoading = (path) => {
  const { loadings } = getReducerState();
  if (!loadings) {
    return true;
  }
  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i++) {
      if (formatLoading(loadings[path[i]])) {
        return true;
      }
    }
    return false;
  }
  return formatLoading(loadings[path]);
};

export const getResults = (path) => {
  const { results = {} } = getReducerState();
  if (Array.isArray(path)) {
    const ans = [];
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      ans.push(results[key]);
    }
    return ans;
  }
  return results[path];
};

export const getFetchTimes = (path) => {
  const { fetchTimes = {} } = getReducerState();
  if (Array.isArray(path)) {
    const ans = [];
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      ans.push(fetchTimes[key]);
    }
    return ans;
  }
  return fetchTimes[path];
};

const getPropsFromKeys = (keys, loading, results) => {
  const props = { loading };
  keys.forEach((key, index) => {
    props[key] = results[index];
  });
  return props;
};

const getProps = (key, loading, results) => {
  if (typeof key === 'string') {
    return { loading, [key]: results };
  }
  return getPropsFromKeys(key, loading, results);
};

export const mapResultToProps = (key) => (state, ownProps) => {
  if (typeof key === 'string' || Array.isArray(key)) {
    return getProps(key, getLoading(key), getResults(key));
  }
  const props = getProps(key.result || key.entity, getLoading(key.loading || key.entity), getResults(key.result || key.entity));
  if (key.selector && typeof key.selector === 'function') {
    return key.selector(props, ownProps);
  }
  return props;
};
