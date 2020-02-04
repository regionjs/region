import { FC } from 'react';
import createCombinedRegion, { CreateCombinedRegionPureReturnValue } from '../createCombinedRegion';
import { AsyncFunctionOrPromise, LoadOption, OptionOrReducer, ResultFunc, ResultFuncPure } from '../types';
import { hoc } from './hoc';

export interface CreateRegionReturnValue<V> {
  set: (resultOrFunc: V | ResultFunc<V>) => V;
  load: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V | void>;
  loadBy: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V | void>;
  getMap: () => {[key: string]: V};
  getId: () => string | undefined;
  getValue: () => V | undefined;
  getLoading: () => boolean;
  getError: () => Error | undefined;
  getFetchTime: () => number | undefined;
  getProps: () => any;
  connect: (Component: any, alias?: string) => FC<any>;
  useMap: () => {[key: string]: V};
  useId: () => string | undefined;
  useValue: () => V | undefined;
  useLoading: () => boolean;
  useError: () => Error | undefined;
  useFetchTime: () => number | undefined;
  useProps: () => any;
}

export interface CreateRegionPureReturnValue<V> extends Omit<CreateRegionReturnValue<V>, 'set' | 'load' | 'loadBy' | 'getValue' | 'useValue'> {
  set: (resultOrFunc: V | ResultFuncPure<V>) => V;
  load: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => Promise<V>;
  loadBy: <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    optionOrReducer?: OptionOrReducer<TParams, TResult, V>,
    exOption?: LoadOption<TParams, TResult, V>,
  ) => (params: TParams) => Promise<V>;
  getValue: () => V;
  useValue: () => V;
}

// overload is unsafe in some way, ensure the return type is correct
function createRegion <V>(initialValue: void): CreateRegionReturnValue<V>;
function createRegion <V>(initialValue: V): CreateRegionPureReturnValue<V>;
function createRegion <V>(initialValue: void | V): CreateRegionReturnValue<V> | CreateRegionPureReturnValue<V> {
  let region: CreateCombinedRegionPureReturnValue<{value: V}>;
  if (initialValue !== undefined) {
    region = createCombinedRegion<{value: V}>({ value: initialValue });
  } else {
    region = createCombinedRegion<{value: V}>() as CreateCombinedRegionPureReturnValue<{value: V}>;
  }

  const set = (resultOrFunc: V | ResultFuncPure<V>) => {
    return region.set('value', resultOrFunc);
  };

  const load = <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    option: OptionOrReducer<TParams, TResult, V> = {},
    exOption?: LoadOption<TParams, TResult, V>,
  ) => {
    return region.load('value', asyncFunction, option, exOption);
  };

  const loadBy = <TParams = void, TResult = unknown>(
    asyncFunction: AsyncFunctionOrPromise<TParams, TResult>,
    option: OptionOrReducer<TParams, TResult, V> = {},
    exOption?: LoadOption<TParams, TResult, V>,
  ) => {
    return region.loadBy('value', asyncFunction, option, exOption);
  };

  const getProps = () => {
    return region.getProps('value');
  };

  const getMap = () => {
    return region.getMap('value');
  };

  const getId = () => {
    return region.getId('value');
  };

  const getValue = () => {
    return region.getValue('value');
  };

  const getLoading = () => {
    return region.getLoading('value');
  };

  const getError = () => {
    return region.getError('value');
  };

  const getFetchTime = () => {
    return region.getFetchTime('value');
  };

  const useProps = () => {
    return region.useProps('value');
  };

  const useMap = () => {
    return region.useMap('value');
  };

  const useId = () => {
    return region.useId('value');
  };

  const useValue = () => {
    return region.useValue('value');
  };

  const useLoading = () => {
    return region.useLoading('value');
  };

  const useError = () => {
    return region.useError('value');
  };

  const useFetchTime = () => {
    return region.useFetchTime('value');
  };

  const connect = (Component: any, alias: string = 'value') => {
    return hoc({ Component, alias, useProps });
  };

  return {
    set,
    load,
    loadBy,
    getMap,
    getId,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    getProps,
    connect,
    useMap,
    useId,
    useValue,
    useLoading,
    useError,
    useFetchTime,
    useProps,
  };
}

export default createRegion;
