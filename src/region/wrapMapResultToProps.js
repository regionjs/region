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

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.mapResultToProps = this.mapResultToProps.bind(this);
    }

    mapResultToProps(key) {
      const { getLoading, getResults } = this;
      return (state, ownProps) => {
        if (typeof key === 'string' || Array.isArray(key)) {
          return getProps(key, getLoading(key), getResults(key));
        }
        const props = getProps(key.result || key.entity, getLoading(key.loading || key.entity), getResults(key.result || key.entity));
        if (key.selector && typeof key.selector === 'function') {
          return key.selector(props, ownProps);
        }
        return props;
      };
    }
  }
  return Region;
};
