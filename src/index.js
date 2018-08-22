import 'babel-polyfill';
import { asyncLoad as rawAsyncLoad, load } from './load';
import { mapResultToProps, getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { reducer, getReducer as rawGetReducer } from './reducer';
import { setConfig } from './util/config';

const asyncLoad = (dispatch, getState, key, Promise, props) => {
  console.warn('asyncLoad is deprecated, use load instead');
  rawAsyncLoad(dispatch, getState, key, Promise, props);
};

const getReducer = (config) => {
  console.warn('getReducer is deprecated, use reducer instead');
  rawGetReducer(config);
};

export { asyncLoad, load, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, getReducer, setConfig };
