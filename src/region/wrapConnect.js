import { connect as rawConnect } from 'react-redux';
import hoc from '../util/hoc';
import { isValidConnectKey } from '../util/isValidConnectKey';

const empty = () => null;

export default (RegionIn) => {
  class Region extends RegionIn {
    connectWith = (key, DisplayComponent, LoadingComponent) => {
      if (isValidConnectKey(key)) {
        const { mapResultToProps, silentConnect } = this;
        const defaultLoading = silentConnect ? empty : DisplayComponent;
        const WrapperComponent = hoc(DisplayComponent || empty, LoadingComponent || defaultLoading);
        return rawConnect(mapResultToProps(key))(WrapperComponent);
      }
      console.error('invalid key, provide valid key or use connect from \'react-redux\' directly');
      return rawConnect(key)(DisplayComponent);
    }
  }
  return Region;
};
