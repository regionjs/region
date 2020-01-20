// public
// useProps
export interface ComplexKey<K> {
  key?: K;
  loading?: K;
  result?: K;
  fetchTime?: K;
  error?: K;
}

export type LegacyKey<K> = K | K[] | ComplexKey<K>;

// connect
export interface ConnectOption {
  Loading?: any;
  Error?: any;
}

// set & load
// set
export type ResultFunc<V> = (snapshot?: V) => V;
export type ResultOrFunc<V> = V | ResultFunc<V>;

// load
export type AsyncFunction<TParams, TResult> = (params: TParams) => Promise<TResult>;
// actually we supports Promise<TResult> | TResult, but it is not supported in Type
export type AsyncFunctionOrPromise<TParams, TResult> = AsyncFunction<TParams, TResult>;

export type AsyncFunctionWithoutParams<V> = () => Promise<V>;
export type AsyncFunctionOrPromiseWithoutParams<V> = AsyncFunctionWithoutParams<V> | Promise<V> | V;

export type Id = string | number;
type Format<TResult, V> = (result: TResult, snapshot?: V) => V;
type Reducer<TParams, TResult, V> = (state: V | undefined, result: TResult, params: TParams) => V;

export type IdFunc<TParams> = (params: TParams) => Id;

export interface LoadOption<TParams, TResult, V> {
  format?: Format<TResult, V>;
  reducer?: Reducer<TParams, TResult, V>;
  forceUpdate?: boolean;
  params?: TParams;
  id?: Id | IdFunc<TParams>;
  delay?: boolean;
}

export type OptionOrReducer<TParams, TResult, V> = LoadOption<TParams, TResult, V> | Reducer<TParams, TResult, V>;

// private
// get
// reducer

export interface LoadPayload<K, TResult> {
  key: K;
  promise: Promise<TResult>;
  id?: Id;
}

export interface Payload<T, K extends keyof T> {
  key: K;
  result?: T[K];
  id?: Id;
  error?: any;
}

// internal
export interface Props<V> {
  loading?: number;
  result?: V;
  id?: any;
  promise?: Promise<unknown>;
  error?: any;
  fetchTime?: number;
  results: {[key: string]: V};
}

export type PropsAttribute<T> = keyof Props<T>;

export type State<T> = {
  [P in keyof T]?: Props<T[P]>;
};
