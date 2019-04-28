import { ComponentType as RawComponentType } from 'react';

export type ComponentType = RawComponentType | any;

// public
// useProps
type BaseKey = string | string[];
interface ComplexKey {
  key?: BaseKey;
  loading?: BaseKey;
  result?: BaseKey;
  fetchTime?: BaseKey;
  error?: BaseKey;
  selector?: any;
}
export type Key = BaseKey | ComplexKey;

// connect
export type DisplayType = ComponentType;

// set & load
export type EntityName = string;

// set
export type Result = any;

// load
export type AsyncFunction = any;
export type Params = any;
export type Format = (result: any, snapshot: any) => any;

// Region config
export type Name = string;

// provide

// private
// get
export type Path = string | string[];

// reducer

// other
// selectProps
export type SelectPropsKey = string | string[];
// loading === undefined occurs when strictLoading === false
export type Loading = boolean | undefined;
export type Loadings = Loading | Loading[];
export type Results = Result | Result[];
export type FetchTime = number;
export type FetchTimes = FetchTime | FetchTime[];
export type Error = any;
export type Errors = Error | Error[];
