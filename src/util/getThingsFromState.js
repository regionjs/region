import { reducerPath } from './config';

const getReducerState = (state) => {
  // TODO complex path
  if (reducerPath === null) {
    return state || {};
  }
  return state[reducerPath] || {};
};

export const getLoading = (state, path) => {
  const { loadings } = getReducerState(state);
  if (!loadings) {
    return true;
  }
  if (Array.isArray(path)) {
    for (let i = 0; i < path.length; i++) {
      if (loadings[path[i]]) { // exclude undefined
        return true;
      }
    }
    return false;
  }
  return loadings[path];
};

export const getResults = (state, path) => {
  const { results = {} } = getReducerState(state);
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

export const getFetchTimes = (state, path) => {
  const { fetchTimes = {} } = getReducerState(state);
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

export const mapResultToProps = (path) => (state) => {
  const loading = getLoading(state, path);
  const results = getResults(state, path);
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
