import selectProps from '../util/selectProps';

const select = ({ selector, props }) => {
  if (selector && typeof selector === 'function') {
    console.warn('selector is deprecated, use useProps and hooks into it, see examples on https://github.com/regionjs/region-core/blob/master/example/src/Selector/index.jsx');
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
          return selectProps(
            key,
            getLoading(key),
            getResults(key),
            getError(key),
          );
        }
        const props = selectProps(
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
