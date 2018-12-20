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
    constructor() {
      super();
      this.getState = this.getState.bind(this);
      this.getLoading = this.getLoading.bind(this);
      this.getResults = this.getResults.bind(this);
      this.getFetchTimes = this.getFetchTimes.bind(this);
    }

    getState() {
      const { store, reducerPath } = this;
      const state = store.getState();
      if (reducerPath === null) {
        return state || {};
      }
      return state[reducerPath] || {};
    }

    getLoading(path) {
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

    getResults(path) {
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

    getFetchTimes(path) {
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
  }
  return Region;
};
