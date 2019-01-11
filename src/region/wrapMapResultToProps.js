const getProps = (keys, loading, results, error) => {
  // TODO 是否要把 error: '' 给用户
  if (typeof keys === 'string') {
    const props = { loading, [keys]: results };
    if (error !== '') {
      props.error = error;
    }
    return props;
  }
  const props = { loading };
  if (error !== '') {
    props.error = error;
  }
  keys.forEach((key, index) => {
    props[key] = results[index];
  });
  return props;
};

export default (RegionIn) => {
  class Region extends RegionIn {
    private_selectorFactory = (key) => {
      const { getLoading, getResults, getError } = this;
      return (state, ownProps) => {
        if (typeof key === 'string' || Array.isArray(key)) {
          return getProps(
            key,
            getLoading(key),
            getResults(key),
            getError(key)
          );
        }
        if (key.entity) {
          console.warn('entity is deprecated, use key instead');
        }
        const props = getProps(
          key.result || key.key || key.entity,
          getLoading(key.loading || key.key || key.entity),
          getResults(key.result || key.key || key.entity),
          getError(key.error || key.key || key.entity)
        );
        if (key.selector && typeof key.selector === 'function') {
          return key.selector(props, ownProps);
        }
        return props;
      };
    }
  }
  return Region;
};
