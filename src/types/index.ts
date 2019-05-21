import { ComponentType as RawComponentType } from 'react';

export type Any = any;

export interface Props {
  [key: string]: Any;
}

export type ComponentType = RawComponentType | any;

// public
// useProps
export type SimpleKey = string;
export type SimpleKeys = SimpleKey[];
export type BaseKey = SimpleKey | SimpleKeys;
interface ComplexKey {
  key?: BaseKey;
  loading?: BaseKey;
  result?: BaseKey;
  fetchTime?: BaseKey;
  error?: BaseKey;
}

export type Key = BaseKey | ComplexKey;

// connect
export type DisplayType = ComponentType;

export interface ConnectOption {
  Loading?: ComponentType;
  Error?: ComponentType;
}

// set & load
export type EntityName = string;

// set
export type Result = any;

// load
export type AsyncFunction = any;
export type Params = any;
type Format = (result: any, snapshot: any) => any;

export interface LoadOption {
  format?: Format;
  forceUpdate?: boolean;
  params?: Params;
  id?: string;
}

// effect
export type GetDerivedStateFromProps = (props: Props, snapshot: any) => any;
// Region config
export type Name = string;

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
// loading === undefined occurs when strictLoading === false
export type Loading = boolean | undefined;
export type FetchTime = number;
export type Error = any;

export interface SelectPropsParams {
  keys: SimpleKeys;
  loadings: Loading[];
  results: Result[];
  fetchTimes: FetchTime[];
  errors: Error[];
}
