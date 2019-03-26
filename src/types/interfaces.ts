import { Params, Format, Name } from './types';

// public
// useProps
// connect
export interface ConnectOptions {
  Loading?: any;
  Error?: any;
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
  DefaultLoading?: any;
  DefaultError?: any;
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
