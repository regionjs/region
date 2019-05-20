import { Any } from './basic';
import { Params, Format, Name, ComponentType, SimpleKeys, Loading, Result, FetchTime, Error } from './types';

// public
// useProps
// connect
export interface ConnectOption {
  Loading?: ComponentType;
  Error?: ComponentType;
}

// set & load
// set
// load
export interface LoadOption {
  format?: Format;
  forceUpdate?: boolean;
  params?: Params;
  id?: string;
}

// Region config
export interface StrictConfig {
  name?: Name;
  expiredTime?: number;
  enableLog?: boolean;
  strictLoading?: boolean;
  DefaultLoading?: ComponentType;
  DefaultError?: ComponentType;
}

export type Config = StrictConfig | Name;

// private
// get
// reducer
export interface State {
  [key: string]: Any;
}

export interface Payload {
  key: string;
  result?: Any;
  error?: Error;
}

export interface Action {
  type: string;
  payload: Payload;
}

// other
// selectProps
export interface SelectPropsParams {
  keys: SimpleKeys;
  loadings: Loading[];
  results: Result[];
  fetchTimes: FetchTime[];
  errors: Error[];
}
