import { createStore } from 'redux';
import Region from '../index';
import { setStore } from '../../global/store';

setStore(createStore(() => {}));
const region = new Region({ name: null });

export { region };
