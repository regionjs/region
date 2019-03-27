import { Params, Format, Name, ComponentType } from './types';

// public
// useProps
// connect
export interface ConnectOptions {
  Loading?: ComponentType;
  Error?: ComponentType;
}

// set & load
// set
// load
export interface LoadOptions {
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

// provide
export interface ProvideOptions {
  store?: any;
  reducers?: any;
}

// private
// get
// reducer
export interface Payload {
  key: string;
  result?: any;
  error?: Error;
  withLoadEnd?: boolean;
}

export interface Action {
  type: string;
  payload: Payload;
}
