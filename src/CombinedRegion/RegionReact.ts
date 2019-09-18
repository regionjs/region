import { useState, useEffect, useRef } from 'react';
import { Store } from 'redux';
import * as shallowEqual from 'shallowequal';
import RegionPublic from './RegionPublic';
import { hoc, isValidConnectKey } from '../util';
import { Props, Key, DisplayType, ConnectOption, SimpleKey } from '../types';

const Empty = () => null;

const strictEqual = (a: any, b: any) => a === b;

interface CreateHooksParams {
  getFn: (key: any) => any;
  equalityFn: (a: any, b: any) => boolean;
  store: Store;
}

const createHooks = ({ getFn, equalityFn, store }: CreateHooksParams) => {
  const useHook: (key: Key | SimpleKey) => any = (key) => {
    const [, forceUpdate] = useState({});
    const ref = useRef();
    ref.current = getFn(key);
    useEffect(
      () => {
        let didUnsubscribe = false;

        const checkForUpdates = () => {
          if (didUnsubscribe) {
            return;
          }
          const nextValue = getFn(key);
          if (!equalityFn(ref.current, nextValue)) {
            ref.current = nextValue;
            forceUpdate({});
          }
        };

        const unsubscribe = store.subscribe(checkForUpdates);

        checkForUpdates();

        return () => {
          didUnsubscribe = true;
          unsubscribe();
        };
      },
      [],
    );
    return ref.current;
  };
  return useHook;
};

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
  useProps: (key: Key) => Props = createHooks({ getFn: this.getProps, equalityFn: shallowEqual, store: this.private_store });

  useValue = createHooks({ getFn: this.getValue, equalityFn: strictEqual, store: this.private_store });

  useLoading = createHooks({ getFn: this.getLoading, equalityFn: strictEqual, store: this.private_store });

  useError = createHooks({ getFn: this.getError, equalityFn: strictEqual, store: this.private_store });

  useFetchTime = createHooks({ getFn: this.getFetchTime, equalityFn: strictEqual, store: this.private_store });
}

export default RegionReact;
