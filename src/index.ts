import CombinedRegion from './CombinedRegion';
import createRegion from './createRegion/createRegion';
import createLocalStorageRegion from './createRegion/createLocalStorageRegion';
import { deprecate } from './util';
import { Config } from './types';

class Region extends CombinedRegion {
  constructor(option: any) {
    super(option);
    deprecate('Region is renamed as createCombinedRegion');
  }
}

const createCombinedRegion = (config?: Config) => {
  return new CombinedRegion(config, true);
};

export { createContext, useContext } from './Context';
export { createCombinedRegion, CombinedRegion, Region, createRegion, createLocalStorageRegion };
