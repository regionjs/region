import Region from '../Region';
import { AsyncFunction, LoadOption, Result } from '../types';

class Prop extends Region {

  set = (result: Result, option: LoadOption = {}) => {
    const { name } = this;
    // @ts-ignore
    return super.set(name, result, option);
  }

  // @ts-ignore
  setBy = (option: LoadOption = {}) => {
    const { name } = this;
    // @ts-ignore
    return super.setBy(name, option);
  }

  load = async (asyncFunction: AsyncFunction, option: LoadOption = {}) => {
    const { name } = this;
    // @ts-ignore
    return super.load(name, asyncFunction, option);
  }

  // @ts-ignore
  loadBy = async (asyncFunction: AsyncFunction, option: LoadOption = {}) => {
    const { name } = this;
    // @ts-ignore
    return super.loadBy(name, asyncFunction, option);
  }

  getProps = () => {
    const { name } = this;
    // @ts-ignore
    return super.getProps(name);
  }

  useProps = () => {
    const { name } = this;
    // @ts-ignore
    return super.useProps(name);
  }

  // @ts-ignore
  connect = undefined;
  // @ts-ignore
  connectWith = undefined;
}

export default Prop;
