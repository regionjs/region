import { createStore } from 'redux';
import Region from '../../region';
import { setStore } from '../../global/store';

setStore(createStore(() => {}));
export const region = new Region(null);
