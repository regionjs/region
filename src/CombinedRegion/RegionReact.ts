import { useState, useEffect } from 'react';
import * as shallowEqual from 'shallowequal';
import RegionPublic from './RegionPublic';
import { hoc, isValidConnectKey } from '../util';
import { Props, Key, DisplayType, ConnectOption, SimpleKey } from '../types';

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
   * The store is bound to region and can not be changed.
   * So it is unnecessary to check whether store is memoized.
   * Some code is write for async mode. And they are not easy to test.
   * @see {
   *   @link https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189|
   *   Advanced example for manually managing subscriptions in an async-safe way using hooks
   * }
   * @param key string | string[]
   */
  useProps = (key: Key): Props => {
    const { private_store, getProps } = this;
    const [props, setProps] = useState(getProps(key));
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          const nextProps = getProps(key);
          setProps((prevProps) => {
            if (!shallowEqual(prevProps, nextProps)) {
              return nextProps;
            }
            return prevProps;
          });
        };

        const unsubscribe = private_store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return props;
  }

  useValue = (key: SimpleKey) => {
    const { private_store, getValue } = this;
    const [value, setValue] = useState(getValue(key));
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          setValue(getValue(key));
        };

        const unsubscribe = private_store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return value;
  }

  useLoading = (key: SimpleKey) => {
    const { private_store, getLoading } = this;
    const [loading, setLoading] = useState(getLoading(key));
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          setLoading(getLoading(key));
        };

        const unsubscribe = private_store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return loading;
  }

  useError = (key: SimpleKey) => {
    const { private_store, getError } = this;
    const [error, setError] = useState(getError(key));
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          setError(getError(key));
        };

        const unsubscribe = private_store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return error;
  }

  useFetchTime = (key: SimpleKey) => {
    const { private_store, getFetchTime } = this;
    const [fetchTime, setFetchTime] = useState(getFetchTime(key));
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          setFetchTime(getFetchTime(key));
        };

        const unsubscribe = private_store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return fetchTime;
  }
}

export default RegionReact;
