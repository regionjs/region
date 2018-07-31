import 'babel-polyfill';
import { asyncLoad, load } from './load';
import { mapResultToProps, getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { getReducer } from './reducer';
import { setConfig as rawSetConfig } from './util/config';

const setConfig = (config) => {
  console.warn('setConfig is deprecated, just pass config through getReducer');
  rawSetConfig(config);
};

export { asyncLoad, load, mapResultToProps, getLoading, getResults, getFetchTimes, getReducer, setConfig };
