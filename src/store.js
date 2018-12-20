import { createStore, combineReducers } from 'redux';
import { reducer as results } from './reducer';
import { setConfig } from './util/region';

const reducer = combineReducers({ results });
const store = createStore(reducer);

setConfig({ store, reducerPath: 'results' });

export default store;
