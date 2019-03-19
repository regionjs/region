import selectProps from '../util/selectProps';
import deprecate from '../util/deprecate';
import { getStore } from '../global/store';
import { Key, Path } from '../types/types';

type Values = {[key: string]: any};

const formatLoading = (loading?: boolean, strictLoading?: boolean) => {
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

const mapValues = (values: Values, path: Path) => {
  if (Array.isArray(path)) {
    return path.map(i => values[i]);
  }
  return values[path];
};

/**
 * @deprecated
 */
// @ts-ignore
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

export default (Region: any) => {
  class RegionPrivate extends Region {
    private_getState = () => {
      const { name } = this;
      const { getState } = getStore();
      const state = getState();
      if (name === null) {
        return state || {};
      }
      return state[name] || {};
    }

    private_getLoading = (path: Path) => {
      const { private_getState, strictLoading } = this;
      const { loadings } = private_getState();
      if (!loadings) {
        return true;
      }
      const mapLoadings = mapValues(loadings, path);
      if (Array.isArray(mapLoadings)) {
        return mapLoadings.map(i => formatLoading(i, strictLoading)).reduce((a, b) => a || b, false);
      }
      return formatLoading(mapLoadings, strictLoading);
    }

    private_getFetchTimes = (path: Path) => {
      const { private_getState } = this;
      const { fetchTimes = {} } = private_getState();
      return mapValues(fetchTimes, path);
    }

    private_getResults = (path: Path) => {
      const { private_getState } = this;
      const { results = {} } = private_getState();
      return mapValues(results, path);
    }

    private_getError = (path: Path) => {
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

    getProps = (key: Key) => {
      const { private_getLoading: getLoading, private_getResults: getResults, private_getError: getError } = this;
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

    private_selectorFactory = (key: Key) => {
      const { getProps } = this;
      return (state: any, ownProps: any) => {
        const props = getProps(key);
        const selectedProps = select({ selector: key.selector, props, ownProps });
        return { ...props, ...selectedProps };
      };
    }
  }
  return RegionPrivate;
};
