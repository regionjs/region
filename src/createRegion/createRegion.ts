import CombinedRegion from '../CombinedRegion';
import { AsyncFunction, Config, LoadOption, Result } from '../types';

export class Region {
  region: CombinedRegion;

  constructor(config: Config = 'data') {
    this.region = new CombinedRegion(config);
  }

  set = (result: Result, option: LoadOption= {}) => {
    const { region } = this;
    return region.set(region.name, result, option);
  }

  setBy = (option: LoadOption = {}) => {
    const { region } = this;
    return region.setBy(region.name, option);
  }

  load = (asyncFunction: AsyncFunction, option: LoadOption= {}) => {
    const { region } = this;
    return region.load(region.name, asyncFunction, option);
  }

  loadBy = (asyncFunction: AsyncFunction, option: LoadOption= {}) => {
    const { region } = this;
    return region.loadBy(region.name, asyncFunction, option);
  }

  getProps = () => {
    const { region } = this;
    return region.getProps(region.name);
  }

  getValue = () => {
    const { region } = this;
    return region.getProps(region.name);
  }

  useProps = () => {
    const { region } = this;
    return region.useProps(region.name);
  }

  useValue = () => {
    const { region } = this;
    return region.useValue(region.name);
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
