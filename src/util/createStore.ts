import { setValueDeep } from './reducerPrototype';
import { State, Payload } from '../types';

const increase = (v: number = 0) => v + 1;
const decrease = (v: number = 0) => v - 1 > 0 ? v - 1 : 0;

const setKey = (state: State, { key, result, results, id, error }: Payload) => {
  const fetchTime = new Date().getTime();
  setValueDeep(state, [key, 'fetchTime'], fetchTime);
  setValueDeep(state, [key, 'id'], id); // as well id === undefined
  if (id !== undefined) {
    setValueDeep(state, [key, 'results'], results);
  }
  setValueDeep(state, [key, 'result'], result);
  setValueDeep(state, [key, 'error'], error); // as well error ===  undefined
  setValueDeep(state, [key, 'loading'], decrease);
  return state;
};

type Listener = () => void;

export const createStore = () => {
  let state = {};
  const listeners: Listener[] = [];

  const emit = () => {
    listeners.forEach(listener => listener());
  };

  const getState = () => state;

  const load = (payload: Payload) => {
    const { key } = payload;
    setValueDeep(state, [key, 'loading'], increase);
    emit();
    return state;
  };

  const set = (payload: Payload) => {
    const { key, result, results, id, error } = payload;
    const nextState = setKey(state, { key, result, results, id, error });
    if (error) {
      console.error(error.message);
    }
    state = nextState;
    emit();
    return state;
  };

  const reset = () => {
    state = {};
    emit();
  };

  const subscribe = (listener: Listener) => {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  };

  return { getState, load, set, reset, subscribe };
};
