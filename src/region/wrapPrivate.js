import selectProps from '../util/selectProps';
import deprecate from '../util/deprecate';

const select = ({ selector, props, ownProps }) => {
  if (selector && typeof selector === 'function') {
    if (!ownProps) {
      deprecate('selector is deprecated. This may cause the error. Use unstable_connect instead, or use useProps and hooks into it.');
    } else {
      deprecate('selector is deprecated. Use unstable_connect instead, or use useProps and hooks into it.');
    }
    return selector({ ...props, ...ownProps }, { ...props, ...ownProps });
  }
  return {};
};

export default (Region) => {
  class RegionPrivate extends Region {
    private_selectorFactory = (key) => {
      const { getProps } = this;
      return (state, ownProps) => {
        const props = getProps(key);
        const selectedProps = select({ selector: key.selector, props, ownProps });
        return { ...props, ...selectedProps };
      };
    }

    getProps = (key) => {
      const { getLoading, getResults, getError } = this;
      if (typeof key === 'string' || Array.isArray(key)) {
        return selectProps(
          key,
          getLoading(key),
          getResults(key),
          getError(key),
        );
      }
      return selectProps(
        key.result || key.key,
        getLoading(key.loading || key.key),
        getResults(key.result || key.key),
        getError(key.error || key.key),
      );
    }
  }
  return RegionPrivate;
};
