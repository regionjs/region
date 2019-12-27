import { State, Props, PropsAttribute, Payload, LoadPayload } from '../types';

const increase = (v: number = 0) => v + 1;
const decrease = (v: number = 0) => v - 1 > 0 ? v - 1 : 0;

type Listener = () => void;

export const createStore = <T>() => {
  let state: State<T> = {};
  const listeners: Listener[] = [];

  const ensure = <K extends keyof T>(key: K) => {
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
  const private_setState = (value: State<T>) => {
    state = value;
  };

  const getAttribute = <K extends keyof T, A extends keyof Props<T[K]>>(key: K, attribute: A): Props<T[K]>[A] => {
    const props = state[key];
    if (!props) {
      return undefined;
    }
    return props[attribute];
  };

  const load = <K extends keyof T, TResult>(payload: LoadPayload<K, TResult>) => {
    const { key, promise, id } = payload;

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<T[K]>;

    props.id = id; // as well id === undefined
    props.result = props.results[id as string];
    props.promise = promise;
    props.loading = increase(props.loading);
    emit();
    return state;
  };

  const setCache = <K extends keyof T>(payload: Payload<T, K>) => {
    const { key, result, id } = payload;
    const currentId = getAttribute(key, 'id');

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<T[K]>;

    if (id !== currentId) {
      const snapshot = props.results[id as string];
      const formatResult = typeof result === 'function' ? result(snapshot) : result;
      props.results = { ...props.results, [id as string]: formatResult };
    }
    props.loading = decrease(props.loading);
    // we should trigger useMap & useLoading anyway
    emit();
    return state;
  };

  const set = <K extends keyof T>(payload: Payload<T, K>) => {
    const { key, result, id, error } = payload;

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<T[K]>;

    const snapshot = props.results[id as string];
    const formatResult = typeof result === 'function' ? result(snapshot) : result;
    props.results = { ...props.results, [id as string]: formatResult };
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
