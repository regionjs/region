import { connect as rawConnect } from 'react-redux';
import hoc from '../util/hoc';
import { isValidConnectKey } from '../util/isValidConnectKey';

const empty = () => null;

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.connectWith = this.connectWith.bind(this);
    }

    connectWith(key, DisplayComponent, LoadingComponent) {
      if (isValidConnectKey(key)) {
        const { mapResultToProps, silentConnect } = this;
        const defaultLoading = silentConnect ? empty : DisplayComponent;
        const WrapperComponent = hoc(DisplayComponent || empty, LoadingComponent || defaultLoading);
        return rawConnect(mapResultToProps(key))(WrapperComponent);
      }
      console.warn('key should be string or array of string');
      return rawConnect(key)(DisplayComponent);
    }
  }
  return Region;
};
