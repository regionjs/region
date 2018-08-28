import 'babel-polyfill';
import { load } from './load';
import { mapResultToProps, getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { reducer } from './reducer';
import { connect } from './connect';
import { setConfig } from './util/config';

export { load, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, connect, setConfig };
