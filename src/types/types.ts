import { ComponentType as RawComponentType } from 'react';

export type ComponentType = RawComponentType | any;

// public
// useProps
type BaseKey = string | string[];
interface ComplexKey {
  key: BaseKey;
  loading: BaseKey;
  result: BaseKey;
  error: BaseKey;
  selector: any;
}
export type Key = BaseKey | ComplexKey | any;

// connect
export type DisplayType = ComponentType;

// set & load
export type EntityName = string;

// set
export type Result = any;

// load
export type AsyncFunction = any;
export type Params = any;
export type Format = (result: any, snapshot: any, error: any) => any;

// Region config
export type Name = string;

// provide

// private
// get
export type Path = string | string[];

// reducer

// other
/**
 * @type key: EntityName
 */
export type Props = {[key: string]: any};
