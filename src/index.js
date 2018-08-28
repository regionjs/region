import 'babel-polyfill';
import { load } from './load';
import { mapResultToProps, getLoading as rawGetLoading, getResults as rawGetResult, getFetchTimes as rawGetFetchTimes } from './util/getThingsFromState';
import { reducer } from './reducer';
import { connect } from './connect';
import { setConfig } from './util/config';

const getLoading = (state, path) => {
  if (typeof state === 'string' || Array.isArray(state)) {
    return rawGetLoading(state);
  }
  console.warn('just migrate getLoading(state, path) => getLoading(path)');
  return rawGetLoading(path);
};

const getResults = (state, path) => {
  if (typeof state === 'string' || Array.isArray(state)) {
    return rawGetResult(state);
  }
  console.warn('just migrate getResults(state, path) => getResults(path)');
  return rawGetResult(path);
};

const getFetchTimes = (state, path) => {
  if (typeof state === 'string' || Array.isArray(state)) {
    return rawGetFetchTimes(state);
  }
  console.warn('just migrate getFetchTimes(state, path) => getFetchTimes(path)');
  return rawGetFetchTimes(path);
};

export { load, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, connect, setConfig };
