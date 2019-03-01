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

const mapValues = (values, path) => {
  if (Array.isArray(path)) {
    return path.map(i => values[i]);
  }
  return values[path];
};

export default (RegionIn) => {
  class Region extends RegionIn {
    private_getState = () => {
      const { name } = this;
      const { getState } = getStore();
      const state = getState();
      if (name === null) {
        return state || {};
      }
      return state[name] || {};
    }

    getLoading = (path) => {
      const { private_getState, strictLoading } = this;
      const { loadings } = private_getState();
      if (!loadings) {
        return true;
      }
      const mapLoadings = mapValues(loadings, path);
      if (Array.isArray(mapLoadings)) {
        return mapLoadings.map(i => formatLoading(i, { strictLoading })).reduce((a, b) => a || b, false);
      }
      return formatLoading(mapLoadings, { strictLoading });
    }

    getFetchTimes = (path) => {
      const { private_getState } = this;
      const { fetchTimes = {} } = private_getState();
      return mapValues(fetchTimes, path);
    }

    getResults = (path) => {
      const { private_getState } = this;
      const { results = {} } = private_getState();
      return mapValues(results, path);
    }

    getProps = this.getResults

    getError = (path) => {
      const { private_getState } = this;
      const { errors = {} } = private_getState();
      const mapErrors = mapValues(errors, path);
      if (Array.isArray(mapErrors)) {
        const filteredErrors = mapErrors.filter(e => e);
        if (filteredErrors.length > 0) {
          return filteredErrors.map(e => e.message).join(', ');
        }
        return undefined;
      }
      return mapErrors && mapErrors.message;
    }
  }
  return Region;
};
