import RegionInitial from './RegionInitial';
import { formatLoading, mapValues } from '../util';
import { BaseKey, Props } from '../types';

class RegionPrivate extends RegionInitial {
  private_getState = () => {
    const { private_store } = this;
    const { getState } = private_store;
    const state = getState();
    return state || {};
  }

  private_getLoadings = (key: BaseKey) => {
    const { private_getState, strictLoading } = this;
    return mapValues(private_getState(), key, ({ loading }: Props) => formatLoading(loading, strictLoading));
  }

  private_getResults = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), key, ({ result, results, id }: Props) => id ? results[id] : result);
  }

  private_getFetchTimes = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), key, ({ fetchTime }: Props) => fetchTime);
  }

  private_getErrors = (key: BaseKey) => {
    const { private_getState } = this;
    return mapValues(private_getState(), key, ({ error }: Props) => error);
  }
}

export default RegionPrivate;
