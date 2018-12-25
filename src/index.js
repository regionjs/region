import '@babel/polyfill';
import { Provider, getProvider } from './global/Provider';
import { region } from './global/region';
import Region from './region';

export const { setConfig, getLoading, getResults, getFetchTimes, mapResultToProps, set, load, connectWith, reducer } = region;

export { Region, Provider, getProvider };
