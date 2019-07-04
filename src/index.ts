import CombinedRegion from './CombinedRegion';
import createRegion from './createRegion/createRegion';
import createLocalStorageRegion from './createRegion/createLocalStorageRegion';
import { deprecate } from './util';

class Region extends CombinedRegion {
  constructor(option: any) {
    super(option);
    deprecate('Region is renamed as CombinedRegion');
  }
}

export { createContext, useContext } from './Context';
export { CombinedRegion, Region, createRegion, createLocalStorageRegion };
