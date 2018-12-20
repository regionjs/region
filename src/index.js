import '@babel/polyfill';
import { load, set } from './load';
import { getLoading, getResults, getFetchTimes } from './util/getThingsFromState';
import { mapResultToProps } from './util/mapResultToProps';
import { reducer } from './reducer';
import { Provider } from './Provider';
import { connectWith } from './connect';
import { setConfig } from './util/config';

export { load, set, mapResultToProps, getLoading, getResults, getFetchTimes, reducer, Provider, connectWith, setConfig };
