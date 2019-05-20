import RegionInitial from './RegionInitial';
import { formatLoading, mapValues } from '../util';
import { BaseKey } from '../types';

class RegionPrivate extends RegionInitial {
  private_getState = () => {
    const { private_store } = this;
    const { getState } = private_store;
    const state = getState();
    return state || {};
  }

  private_getLoadings = (key: BaseKey) => {
    const { private_getState, strictLoading } = this;
    return mapValues(private_getState(), 'loadings', key, (i: any) => formatLoading(i, strictLoading));
  }

  private_getFetchTimes = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), 'fetchTimes', key);
  }

  private_getResults = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), 'results', key);
  }

  private_getErrors = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), 'errors', key);
  }
}

export default RegionPrivate;
