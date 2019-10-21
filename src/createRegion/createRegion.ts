import createCombinedRegion from '../createCombinedRegion';
import { AsyncFunction, LoadOption, OptionOrReducer, Result } from '../types';
import { hoc } from './hoc';

export class Region {
  region = createCombinedRegion();

  set = (result: Result, option: LoadOption = {}) => {
    const { region } = this;
    return region.set('value', result, option);
  }

  setBy = (option: LoadOption = {}) => {
    const { region } = this;
    return region.setBy('value', option);
  }

  load = (asyncFunction: AsyncFunction, option: OptionOrReducer = {}, exOption?: LoadOption) => {
    const { region } = this;
    return region.load('value', asyncFunction, option, exOption);
  }

  loadBy = (asyncFunction: AsyncFunction, option: OptionOrReducer = {}, exOption?: LoadOption) => {
    const { region } = this;
    return region.loadBy('value', asyncFunction, option, exOption);
  }

  getProps = () => {
    const { region } = this;
    return region.getProps('value');
  }

  getValue = () => {
    const { region } = this;
    return region.getValue('value');
  }

  getLoading = () => {
    const { region } = this;
    return region.getLoading('value');
  }

  getError = () => {
    const { region } = this;
    return region.getError('value');
  }

  getFetchTime = () => {
    const { region } = this;
    return region.getFetchTime('value');
  }

  useProps = () => {
    const { region } = this;
    return region.useProps('value');
  }

  useValue = () => {
    const { region } = this;
    return region.useValue('value');
  }

  useLoading = () => {
    const { region } = this;
    return region.useLoading('value');
  }

  useError = () => {
    const { region } = this;
    return region.useError('value');
  }

  useFetchTime = () => {
    const { region } = this;
    return region.useFetchTime('value');
  }

  connect = (Component: any, alias: string = 'value') => {
    const { useProps } = this;
    return hoc({ Component, alias, useProps });
  }
}

const createRegion = (initialValue?: any) => {
  const region = new Region();
  if (initialValue !== undefined) {
    region.set(initialValue);
  }
  return region;
};

export default createRegion;
