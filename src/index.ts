import createCombinedRegion from './createCombinedRegion';
import createRegion from './createRegion/createRegion';
import createLocalStorageRegion from './createRegion/createLocalStorageRegion';
import { setAcceptLatestFlag, setSwitchIdFlag } from './util';

const unstable_enableExperimental = () => {
  setSwitchIdFlag(true);
  setAcceptLatestFlag(true);
};

export { createCombinedRegion, createRegion, createLocalStorageRegion, unstable_enableExperimental };
