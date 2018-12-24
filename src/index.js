import '@babel/polyfill';
import { Provider } from './global/Provider';
import { region } from './global/region';

export const { setConfig, getLoading, getResults, getFetchTimes, mapResultToProps, set, load, connectWith, reducer } = region;

export { Provider };
