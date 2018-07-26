import 'babel-polyfill';
import { asyncLoad, load } from './load';
import { mapResultToProps, getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { getReducer } from './reducer';
import { setConfig } from './config';

export { asyncLoad, load, mapResultToProps, getLoading, getResults, getFetchTimes, getReducer, setConfig };
