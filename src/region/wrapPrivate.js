import getProps from '../util/getProps';

const select = ({ selector, props }) => {
  if (selector && typeof selector === 'function') {
    return selector(props, props);
  }
  return {};
};

export default (Region) => {
  class RegionPrivate extends Region {
    private_selectorFactory = (key) => {
      const { getLoading, getResults, getError } = this;
      return (state, ownProps) => {
        if (typeof key === 'string' || Array.isArray(key)) {
          return getProps(
            key,
            getLoading(key),
            getResults(key),
            getError(key),
          );
        }
        if (key.entity) {
          console.warn('entity is deprecated, use key instead');
        }
        const props = getProps(
          key.result || key.key || key.entity,
          getLoading(key.loading || key.key || key.entity),
          getResults(key.result || key.key || key.entity),
          getError(key.error || key.key || key.entity),
        );
        const selectedProps = select({ selector: key.selector, props: { ...props, ...ownProps } });
        return { ...props, ...selectedProps };
      };
    }
  }
  return RegionPrivate;
};
