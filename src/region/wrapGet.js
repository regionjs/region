import { getStore } from '../global/store';

const formatLoading = (loading, { strictLoading }) => {
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

export default (RegionIn) => {
  class Region extends RegionIn {
    getState = () => {
      const { name } = this;
      const { getState } = getStore();
      const state = getState();
      if (name === null) {
        return state || {};
      }
      return state[name] || {};
    }

    getLoading = (path) => {
      const { getState, strictLoading } = this;
      const { loadings } = getState();
      if (!loadings) {
        return true;
      }
      if (Array.isArray(path)) {
        for (let i = 0; i < path.length; i++) {
          if (formatLoading(loadings[path[i]], { strictLoading })) {
            return true;
          }
        }
        return false;
      }
      return formatLoading(loadings[path], { strictLoading });
    }

    getFetchTimes = (path) => {
      const { getState } = this;
      const { fetchTimes = {} } = getState();
      if (Array.isArray(path)) {
        const ans = [];
        for (let i = 0; i < path.length; i++) {
          const key = path[i];
          ans.push(fetchTimes[key]);
        }
        return ans;
      }
      return fetchTimes[path];
    }

    getResults = (path) => {
      const { getState } = this;
      const { results = {} } = getState();
      if (Array.isArray(path)) {
        const ans = [];
        for (let i = 0; i < path.length; i++) {
          const key = path[i];
          ans.push(results[key]);
        }
        return ans;
      }
      return results[path];
    }

    getError = (path) => {
      const { getState } = this;
      const { errors = {} } = getState();
      if (Array.isArray(path)) {
        let ans = '';
        for (let i = 0; i < path.length; i++) {
          const key = path[i];
          const error = errors[key];
          if (error) {
            ans += error.message;
          }
        }
        return ans;
      }
      return errors[path];
    }
  }
  return Region;
};
