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

  useProps = () => {
    const { region } = this;
    return region.useProps('data');
  }

  useValue = () => {
    const { region } = this;
    return region.useValue('data');
  }
}

const createRegion = (initialValue: any) => {
  const region = new Region();
  if (initialValue !== undefined) {
    region.set(initialValue);
  }
  return region;
};

export default createRegion;
