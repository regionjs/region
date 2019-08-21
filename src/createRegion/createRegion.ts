import CombinedRegion from '../CombinedRegion';
import { AsyncFunction, LoadOption, Result } from '../types';

export class Region {
  region: CombinedRegion;

  constructor() {
    this.region = new CombinedRegion();
  }

  set = (result: Result, option: LoadOption= {}) => {
    const { region } = this;
    return region.set('data', result, option);
  }

  setBy = (option: LoadOption = {}) => {
    const { region } = this;
    return region.setBy('data', option);
  }

  load = (asyncFunction: AsyncFunction, option: LoadOption= {}) => {
    const { region } = this;
    return region.load('data', asyncFunction, option);
  }

  loadBy = (asyncFunction: AsyncFunction, option: LoadOption= {}) => {
    const { region } = this;
    return region.loadBy('data', asyncFunction, option);
  }

  getProps = () => {
    const { region } = this;
    return region.getProps('data');
  }

  getValue = () => {
    const { region } = this;
    return region.getValue('data');
  }

  getLoading = () => {
    const { region } = this;
    return region.getLoading('data');
  }

  getError = () => {
    const { region } = this;
    return region.getError('data');
  }

  getFetchTime = () => {
    const { region } = this;
    return region.getFetchTime('data');
  }

  useProps = () => {
    const { region } = this;
    return region.useProps('data');
  }

  useValue = () => {
    const { region } = this;
    return region.useValue('data');
  }

  useLoading = () => {
    const { region } = this;
    return region.useLoading('data');
  }

  useError = () => {
    const { region } = this;
    return region.useError('data');
  }

  useFetchTime = () => {
    const { region } = this;
    return region.useFetchTime('data');
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
