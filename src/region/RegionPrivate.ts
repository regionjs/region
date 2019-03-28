import { getStore } from '../global/store';
import { Path } from '../types/types';
import RegionInitial from './RegionInitial';
import { formatLoading, mapValues } from '../util/selectProps';

class RegionPrivate extends RegionInitial {
  private_getState = () => {
    const { name } = this;
    const { getState } = getStore();
    const state = getState();
    return state[name] || {};
  }

  private_getLoadings = (path: Path) => {
    const { private_getState, strictLoading } = this;
    const { loadings } = private_getState();
    return mapValues(loadings, path, (i: any) => formatLoading(i, strictLoading));
  }

  private_getFetchTimes = (path: Path) => {
    const { private_getState } = this;
    const { fetchTimes } = private_getState();
    return mapValues(fetchTimes, path);
  }

  private_getResults = (path: Path) => {
    const { private_getState } = this;
    const { results } = private_getState();
    return mapValues(results, path);
  }

  private_getErrors = (path: Path) => {
    const { private_getState } = this;
    const { errors } = private_getState();
    return mapValues(errors, path);
  }
}

export default RegionPrivate;
