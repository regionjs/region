// public
export type Strategy = 'acceptLatest' | 'acceptEvery';

export interface RegionOption {
  strategy: Strategy;
}

// set & load
// set
export type ResultFunc<V> = (snapshot?: V) => V;
export type ResultFuncPure<V> = (snapshot: V) => V;

// load
export type Reducer<TParams, TResult, V> = (state: V | undefined, result: TResult, params: TParams) => V;
export type ReducerPure<TParams, TResult, V> = (state: V, result: TResult, params: TParams) => V;

// internal
export type Listener = () => void;

export interface Props<V> {
  pendingMutex?: number;
  value?: V;
  promise?: Promise<unknown>;
  error?: unknown;
  listeners?: Listener[];
}
