import Region from '../Region';
import { AsyncFunction, Config, LoadOption, Result } from '../types';

class Prop {
  region: Region;

  constructor(config: Config) {
    this.region = new Region(config);
  }

  set = (result: Result, option: LoadOption) => {
    const { region } = this;
    return region.set(region.name, result, option);
  }

  setBy = (option: LoadOption = {}) => {
    const { region } = this;
    return region.setBy(region.name, option);
  }

  load = async (asyncFunction: AsyncFunction, option: LoadOption) => {
    const { region } = this;
    return region.load(region.name, asyncFunction, option);
  }

  loadBy = async (asyncFunction: AsyncFunction, option: LoadOption) => {
    const { region } = this;
    return region.loadBy(region.name, asyncFunction, option);
  }

  getProps = () => {
    const { region } = this;
    return region.getProps(region.name);
  }

  useProps = () => {
    const { region } = this;
    return region.useProps(region.name);
  }
}

export default Prop;
