import { State, Props, Payload, LoadPayload } from '../types';

const increase = (v: number = 0) => v + 1;
const decrease = (v: number = 0) => v - 1 > 0 ? v - 1 : 0;

type Listener = () => void;

export const createStore = <V>() => {
  type T = {[key: string]: V };
  let state: State<T> = {};
  const listeners: Listener[] = [];

  const ensure = (key: string): void => {
    if (!state[key]) {
      state[key] = {};
    }
  };

  const emit = (): void => {
    listeners.forEach(listener => listener());
  };

  // only used for test
  const private_getState = (): State<T> => {
    return state;
  };

  // only used for test
  const private_setState = (value: State<T>): void => {
    state = value;
  };

  const getAttribute = <A extends keyof Props<V>>(key: string, attribute: A): Props<V>[A] => {
    const props = state[key];
    if (!props) {
      return undefined;
    }
    return props[attribute];
  };

  const load = <TResult>(payload: LoadPayload<TResult>): void => {
    const { key, promise } = payload;

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<V>;

    props.promise = promise;
    props.loading = increase(props.loading);
    emit();
  };

  const loadEnd = (payload: {key: string}): void => {
    const { key } = payload;

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<V>;

    props.loading = decrease(props.loading);
    emit();
  };

  const set = (payload: Payload<V>): void => {
    const { key, result, error } = payload;

    ensure(key);

    // since it is ensured
    const props = state[key] as Props<V>;

    const snapshot = props.result;
    const formatResult = typeof result === 'function' ? result(snapshot) : result;
    props.loading = decrease(props.loading);
    const fetchTime = new Date().getTime();
    props.fetchTime = fetchTime;
    props.result = formatResult;
    props.error = error; // as well error ===  undefined

    if (error) {
      console.error(error);
    }
    emit();
  };

  const reset = (): void => {
    state = {};
    emit();
  };

  const subscribe = (listener: Listener): () => void => {
    listeners.push(listener);
    return () => {
      listeners.splice(listeners.indexOf(listener), 1);
    };
  };

  return { private_getState, private_setState, getAttribute, load, loadEnd, set, reset, subscribe };
};
