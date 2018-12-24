import '@babel/polyfill';
import { load } from './load';
import { set } from './util/set';
import { reducer } from './reducer';
import { Provider } from './Provider';
import { connectWith } from './connect';
import { setConfig, getLoading, getResults, getFetchTimes, mapResultToProps } from './util/region';

export { load, set, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, Provider, connectWith, setConfig };
