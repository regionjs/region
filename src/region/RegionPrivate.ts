import { getStore } from '../global/store';
import { Path } from '../types/types';
import RegionInitial from './RegionInitial';
import { formatLoading, mapValues } from '../util/selectProps';

class RegionPrivate extends RegionInitial {
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
}

export default RegionPrivate;
