import { State, Payload, LoadPayload, EntityName, PropsKey } from '../types';

const increase = (v: number = 0) => v + 1;
const decrease = (v: number = 0) => v - 1 > 0 ? v - 1 : 0;

type Listener = () => void;

export const createStore = () => {
  let state: State = {};
  const listeners: Listener[] = [];

  const ensure = (key: string) => {
    if (!state[key]) {
      state[key] = {
        results: {},
      };
    }
  };

  const emit = () => {
    listeners.forEach(listener => listener());
  };

  // only used for test
  const private_setState = (value: State) => {
    state = value;
  };

  const getAttribute = (key: EntityName, attribute: PropsKey) => {
    const props = state[key] || {};
    return props[attribute];
  };

  const load = (payload: LoadPayload) => {
    const { key, promise, id } = payload;
    ensure(key);
    const props = state[key];
    props.id = id; // as well id === undefined
    props.result = props.results[id as string];
    props.promise = promise;
    props.loading = increase(props.loading);
    emit();
    return state;
  };

  const setCache = (payload: Payload) => {
    const { key, result, id } = payload;
    const currentId = getAttribute(key, 'id');
    ensure(key);
    const props = state[key];
    if (id !== currentId) {
      const snapshot = props.results[id as string];
      const formatResult = typeof result === 'function' ? result(snapshot) : result;
      props.results[id as string] = formatResult;
    }
    props.loading = decrease(props.loading);
    // we should trigger useMap & useLoading anyway
    emit();
    return state;
  };

  const set = (payload: Payload) => {
    const { key, result, id, error } = payload;
    ensure(key);
    const props = state[key];
    const snapshot = props.results[id as string];
    const formatResult = typeof result === 'function' ? result(snapshot) : result;
    props.results[id as string] = formatResult;
    props.loading = decrease(props.loading);
    const fetchTime = new Date().getTime();
    props.fetchTime = fetchTime;
    props.id = id; // as well id === undefined
    props.result = formatResult;
    props.error = error; // as well error ===  undefined

    if (error) {
      console.error(error.message);
    }
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

  return { getAttribute, private_setState, load, set, setCache, reset, subscribe };
};
