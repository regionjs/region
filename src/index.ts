import '@babel/polyfill';
import provide from './global/provide';
import { getProvider } from './global/Provider';
import Region from './region/index';

provide();

export { Region, getProvider, provide };
