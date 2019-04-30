import { useState, useEffect } from 'react';
import * as shallowEqual from 'shallowequal';
import RegionPublic from './RegionPublic';
import { hoc, isValidConnectKey } from '../util';
import { Props, Key, DisplayType, ConnectOption } from '../types';

const Empty = () => null;

class RegionReact extends RegionPublic {
  connectWith = (key: Key, Display: DisplayType, option?: ConnectOption) => {
    const { connect } = this;
    return connect(key, option)(Display);
  }

  connect = (key: Key, { Loading, Error }: ConnectOption = {}) => (Display: DisplayType = Empty) => {
    const { useProps, DefaultLoading, DefaultError } = this;
    if (!isValidConnectKey(key)) {
      console.error('invalid key, provide valid key or use connect from \'react-redux\' directly');
      return null;
    }
    return hoc({
      Display,
      Loading: Loading || DefaultLoading || Display,
      Error: Error || DefaultError || Display,
      useProps,
      key,
    });
  }

  /**
   * There is only one store bound to all regions. App store is not related unless it is {@code provide()}
   * So it is unnecessary to check whether store is memoized
   * @see {
   *   @link https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189|
   *   Advanced example for manually managing subscriptions in an async-safe way using hooks
   * }
   * The link implies that this hook may broke in async mode.
   * Further information needed.
   * @param key string | string[]
   */
  useProps = (key: Key): Props => {
    const { private_store, getProps } = this;
    const [props, setProps] = useState(getProps(key));
    useEffect(
      () => {
        const unsubscribe = private_store.subscribe(() => {
          const nextProps = getProps(key);
          if (!shallowEqual(props, nextProps)) {
            setProps(nextProps);
          }
        });
        return unsubscribe;
      },
      /**
       * effect should be changed with props, otherwise shallowEqual will never hit
       */
      [props],
    );
    return props;
  }
}

export default RegionReact;
