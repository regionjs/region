import { setValueDeep } from './reducerPrototype';
import { State, Payload, LoadPayload } from '../types';
import undefinedSymbol from './undefinedSymbol';

const increase = (v: number = 0) => v + 1;
const decrease = (v: number = 0) => v - 1 > 0 ? v - 1 : 0;

const setKey = (state: State, { key, result, id, error }: Payload, cache?: boolean) => {
  if (cache) {
    setValueDeep(state, [key, 'results', id], result);
    setValueDeep(state, [key, 'loading'], decrease);
    return state;
  }
  const fetchTime = new Date().getTime();
  setValueDeep(state, [key, 'fetchTime'], fetchTime);
  setValueDeep(state, [key, 'id'], id); // as well id === undefined
  setValueDeep(state, [key, 'results', id], result);
  setValueDeep(state, [key, 'result'], result);
  setValueDeep(state, [key, 'error'], error); // as well error ===  undefined
  setValueDeep(state, [key, 'loading'], decrease);
  return state;
};

type Listener = () => void;

export const createStore = () => {
  let state: State = {};
  const listeners: Listener[] = [];

  const emit = () => {
    listeners.forEach(listener => listener());
  };

  const getState = () => state;

  const load = (payload: LoadPayload) => {
    const { key, promise, id } = payload;
    setValueDeep(state, [key, 'id'], id); // as well id === undefined
    // It could be extracted as mapValue, also some of private get method could inline
    // I will decide later
    const simpleState = state[key] || {};
    if (simpleState.results) {
      const result = simpleState.results[id as string];
      setValueDeep(state, [key, 'result'], result);
    }
    setValueDeep(state, [key, 'promise'], promise);
    setValueDeep(state, [key, 'loading'], increase);
    emit();
    return state;
  };

  const set = (payload: Payload, cache?: boolean) => {
    const { key, result, id, error } = payload;
    const nextState = setKey(state, { key, result, id, error }, cache);
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
