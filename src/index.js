import 'babel-polyfill';
import { asyncLoad as rawAsyncLoad, load } from './load';
import { mapResultToProps, getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { reducer, getReducer as rawGetReducer } from './reducer';
import { setConfig } from './util/config';

const asyncLoad = async (dispatch, getState, key, Promise, props) => {
  console.warn('asyncLoad is deprecated, use load instead');
  const result = await rawAsyncLoad(dispatch, getState, key, Promise, props);
  return result;
};

const getReducer = (config) => {
  console.warn('getReducer is deprecated, use reducer & setConfig instead');
  return rawGetReducer(config);
};

export { asyncLoad, load, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, getReducer, setConfig };
