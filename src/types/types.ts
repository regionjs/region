import { ComponentType as RawComponentType } from 'react';
import { Props } from './basic';

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

// effect
export type GetDerivedStateFromProps = (props: Props, snapshot: any) => any;
// Region config
export type Name = string;

// private
// get
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
