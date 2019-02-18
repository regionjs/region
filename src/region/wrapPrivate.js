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
        const props = getProps(
          key.result || key.key,
          getLoading(key.loading || key.key),
          getResults(key.result || key.key),
          getError(key.error || key.key),
        );
        const selectedProps = select({ selector: key.selector, props: { ...props, ...ownProps } });
        return { ...props, ...selectedProps };
      };
    }
  }
  return RegionPrivate;
};
