import { Params, Format, Name, ComponentType, SelectPropsKey, Loadings, Results, FetchTimes, Errors } from './types';

// public
// useProps
export interface Props {
  [key: string]: any;
}
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
  [key: string]: any;
}

export interface Payload {
  key: string;
  result?: any;
  error?: Error;
}

export interface Action {
  type: string;
  payload: Payload;
}

// other
// selectProps
export interface SelectPropsParams {
  keys: SelectPropsKey;
  loadings: Loadings;
  results: Results;
  fetchTimes: FetchTimes;
  errors: Errors;
}
