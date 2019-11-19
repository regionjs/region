import { ComponentType as RawComponentType } from 'react';

export interface Props {
  [key: string]: any;
}

export type ComponentType = RawComponentType | any;

// public
// useProps
export type SimpleKey = string;
export type SimpleKeys = SimpleKey[];
export type Key = SimpleKey | SimpleKeys;
interface ComplexKey {
  key?: Key;
  loading?: Key;
  result?: Key;
  fetchTime?: Key;
  error?: Key;
}

export type LegacyKey = Key | ComplexKey;

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
type ResultFunc = (snapshot: Snapshot) => Result;
export type ResultOrFunc = Result | ResultFunc;

// load
export type AsyncFunction = any;
export type Params = any;

type Id = string | number;
type Snapshot = any;
type Format = (result: Result, snapshot: Snapshot) => Result;
type Reducer = (state: any, action: any, params: any) => any;

type IdFunc = (params: Params) => Id;

export interface LoadOption {
  format?: Format;
  reducer?: Reducer;
  forceUpdate?: boolean;
  params?: Params;
  id?: Id | IdFunc;
  delay?: boolean;
}

export type OptionOrReducer = LoadOption | Reducer;

// private
// get
// reducer

export interface State {
  [key: string]: any;
}

interface Results {
  [key: string]: Result;
}

export interface LoadPayload {
  key: string;
  promise: Promise<any>;
  id?: Id;
}

export interface Payload {
  key: string;
  result?: Result;
  results?: Results;
  id?: Id;
  error?: Error;
}

// other
// selectProps
// loading === undefined occurs when strictLoading === false
export type Loading = boolean | undefined;
export type FetchTime = number;
export type Error = any;

// formatResult
export interface FormatResultParams {
  resultOrFunc: ResultOrFunc;
  snapshot: Snapshot;
  format?: Format;
  reducer?: Reducer;
  params?: Params;
}

export interface FormatResultWithIdParams {
  resultOrFunc: ResultOrFunc;
  snapshot: Snapshot;
  format?: Format;
  id: Id;
  reducer?: Reducer;
  params?: Params;
}
