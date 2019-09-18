import { ComponentType as RawComponentType } from 'react';

export interface Props {
  [key: string]: any;
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

type Id = any;
type Snapshot = any;
type Format = (result: Result, snapshot: Snapshot) => Result;
type Reducer = (state: any, action: any, params: any) => any;

export interface LoadOption {
  format?: Format;
  reducer?: Reducer;
  forceUpdate?: boolean;
  params?: Params;
  id?: string;
  delay?: boolean;
}

export type OptionOrReducer = LoadOption | Reducer;

// CombinedRegion config
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
  [key: string]: any;
}

export interface Payload {
  key: string;
  result?: Result;
  results?: Result[];
  id?: Id;
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

type ResultFunction = (snapshot: Snapshot) => Result;
// formatResult
export interface FormatResultParams {
  result: ResultFunction | Result;
  snapshot: Snapshot;
  format?: Format;
  reducer?: Reducer;
  params?: Params;
}

export interface FormatResultWithIdParams {
  result: Result;
  snapshot: Snapshot;
  format?: Format;
  id: Id;
  reducer?: Reducer;
  params?: Params;
}
