import createCombinedRegion from '../createCombinedRegion';
import { AsyncFunction, LoadOption, OptionOrReducer, Result } from '../types';
import { hoc } from './hoc';

export const createRegion = (initialValue?: any) => {
  const region = createCombinedRegion();

  const set = (result: Result, option: LoadOption = {}) => {
    return region.set('value', result, option);
  };

  const setBy = (option: LoadOption = {}) => {
    return region.setBy('value', option);
  };

  const load = (asyncFunction: AsyncFunction, option: OptionOrReducer = {}, exOption?: LoadOption) => {
    return region.load('value', asyncFunction, option, exOption);
  };

  const loadBy = (asyncFunction: AsyncFunction, option: OptionOrReducer = {}, exOption?: LoadOption) => {
    return region.loadBy('value', asyncFunction, option, exOption);
  };

  const getProps = () => {
    return region.getProps('value');
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

  if (initialValue !== undefined) {
    set(initialValue);
  }

  return {
    set,
    setBy,
    load,
    loadBy,
    getProps,
    getValue,
    getLoading,
    getError,
    getFetchTime,
    useProps,
    useValue,
    useLoading,
    useError,
    useFetchTime,
    connect,
  };
};

export default createRegion;
