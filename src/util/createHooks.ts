import { useState, useEffect, useRef } from 'react';
import { Key, SimpleKey } from '../types';

interface CreateHooksParams {
  getFn: (key: any) => any;
  equalityFn: (a: any, b: any) => boolean;
  store: any;
}

/**
 * The store is bound to region and can not be changed.
 * So it is unnecessary to check whether store is memoized.
 * Some code is write for async mode. And they are not easy to test.
 * @see {
 *   @link https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189|
 *   Advanced example for manually managing subscriptions in an async-safe way using hooks
 * }
 */
export const createHooks = ({ getFn, equalityFn, store }: CreateHooksParams) => {
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
          /** @see https://github.com/facebook/react/issues/14994 */
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
