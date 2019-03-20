import provide from './global/provide';
import { getProvider } from './global/Provider';
import Region from './region'; // tslint:disable-line import-name

provide();

export { Region, getProvider, provide };
