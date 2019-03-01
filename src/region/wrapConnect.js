import { useState, useEffect } from 'react';
import { connect as rawConnect } from 'react-redux';
import { getStore } from '../global/store';
import hoc, { prehoc } from '../util/hoc';
import { isValidConnectKey } from '../util/isValidConnectKey';

const Empty = () => null;

export default (Region) => {
  class RegionConnect extends Region {
    connectWith = (key, Display, option) => {
      const { connect } = this;
      return connect(key, option)(Display);
    }

    connect = (key, { Loading, Error } = {}) => (Display = Empty) => {
      const { useProps, DefaultLoading, DefaultError } = this;
      if (!isValidConnectKey(key)) {
        console.error('invalid key, provide valid key or use connect from \'react-redux\' directly');
        return null;
      }
      const WrapperComponent = hoc({
        Display,
        Loading: Loading || DefaultLoading || Display,
        Error: Error || DefaultError || Display,
        useProps,
        key,
      });

      return WrapperComponent;
    }

    unstable_connect = (key, { Loading, Error } = {}) => (Display = Empty) => {
      if (isValidConnectKey(key)) {
        const { private_selectorFactory, DefaultLoading, DefaultError } = this;
        const WrapperComponent = prehoc(Display, Loading || DefaultLoading || Display, Error || DefaultError || Display);
        return rawConnect(private_selectorFactory(key))(WrapperComponent);
      }
      console.error('invalid key, provide valid key or use connect from \'react-redux\' directly');
      return rawConnect(key)(Display);
    }


    useProps = (key) => {
      const { private_selectorFactory } = this;
      const store = getStore();
      const [state, setState] = useState(store.getState());
      useEffect(() => {
        const unsubscribe = store.subscribe(() => setState(store.getState()));
        return () => unsubscribe();
      });
      return private_selectorFactory(key)(state);
    }
  }
  return RegionConnect;
};
