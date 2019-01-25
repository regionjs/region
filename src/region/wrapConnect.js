import { connect as rawConnect } from 'react-redux';
import hoc from '../util/hoc';
import { isValidConnectKey } from '../util/isValidConnectKey';

const Empty = () => null;

export default (Region) => {
  class RegionConnect extends Region {
    connectWith = (key, Display, option = {}) => {
      const { connect } = this;
      if (typeof option === 'object') {
        return connect(key, option)(Display);
      }
      console.warn('connectWith receives a wide option, the original param is deprecated, replace with connectWith(key, Display { Loading: LoadingComponent })');
      return connect(key, { Loading: option })(Display);
    }

    connect = (key, { Loading, Error } = {}) => (Display = Empty) => {
      if (isValidConnectKey(key)) {
        const { private_selectorFactory, DefaultLoading, DefaultError } = this;
        const WrapperComponent = hoc(Display, Loading || DefaultLoading || Display, Error || DefaultError || Display);
        return rawConnect(private_selectorFactory(key))(WrapperComponent);
      }
      console.error('invalid key, provide valid key or use connect from \'react-redux\' directly');
      return rawConnect(key)(Display);
    }
  }
  return RegionConnect;
};
