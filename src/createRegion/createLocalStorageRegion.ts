import {getLocalStorageState, setLocalStorageState} from '../util/localStorageUtils';
import createRegion from './createRegion';

type LocalStorageKey = string;

const createLocalStorageRegion = <V>(key: LocalStorageKey, fallbackValue: V) => {
    const region = createRegion<V>(getLocalStorageState(key, fallbackValue));
    const regionSet = region.set;
    region.set = valueOrFunc => {
        const value = typeof valueOrFunc === 'function'
            // @ts-expect-error
            ? valueOrFunc(getLocalStorageState(key, fallbackValue))
            : valueOrFunc;
        setLocalStorageState(key, value);
        return regionSet(value);
    };

    // unable to fire storage event yet, see https://github.com/testing-library/dom-testing-library/issues/438
    typeof window === 'object' && window.addEventListener('storage', e => {
        // istanbul ignore next
        if (e.key === key) {
            // istanbul ignore next
            const value = getLocalStorageState(key, fallbackValue);
            // istanbul ignore next
            regionSet(value);
        }
    });
    return region;
};

export default createLocalStorageRegion;
