import { reducerPath, store, strictLoading } from './config';

const getReducerState = () => {
  // TODO complex path
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

export const mapResultToProps = (path) => () => {
  const loading = getLoading(path);
  const results = getResults(path);
  const props = { loading };
  if (Array.isArray(path)) {
    path.forEach((key, index) => {
      props[key] = results[index];
    });
    return props;
  }
  props[path] = results;
  return props;
};
