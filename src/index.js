import '@babel/polyfill';
import { reducer } from './reducer';
import { Provider } from './Provider';
import { connectWith } from './connect';
import { load } from './util/load';
import { set } from './util/set';
import { setConfig, getLoading, getResults, getFetchTimes, mapResultToProps } from './util/region';

export { load, set, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, Provider, connectWith, setConfig };
