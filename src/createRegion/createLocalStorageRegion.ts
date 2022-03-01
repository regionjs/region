/** TODO add type inference */
import createRegion from './createRegion';

const localStorage = typeof window === 'object' && window.localStorage;

type Key = string;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;

const setLocalStorageState = (key: Key, value: Value) => {
    const jsonString = JSON.stringify(value);
    // JSON.stringify(undefined) === undefined
    // JSON.stringify(null) === 'null'
    if (typeof jsonString === 'string') {
        localStorage && localStorage.setItem(key, jsonString);
    } else {
        localStorage && localStorage.removeItem(key);
    }
};

const getLocalStorageState = (key: Key, fallbackValue: Value) => {
    try {
        const jsonString = localStorage && localStorage.getItem(key);
        if (jsonString === null) {
            // when jsonString === null => item is undefined
            // when jsonString === 'null' => item is null
            setLocalStorageState(key, fallbackValue);
            return fallbackValue;
        }
        // @ts-expect-error
        return JSON.parse(jsonString);
    } catch (e) {
        setLocalStorageState(key, fallbackValue);
        return fallbackValue;
    }
};

const createLocalStorageRegion = <V>(key: Key, fallbackValue: V) => {
    const region = createRegion<V>(getLocalStorageState(key, fallbackValue) as V);
    const regionSet = region.set;
    region.set = valueOrFunc => {
        if (typeof valueOrFunc === 'function') {
            const value = (valueOrFunc as any)(getLocalStorageState(key, fallbackValue));
            setLocalStorageState(key, value);
            return regionSet(value);
        }
        setLocalStorageState(key, valueOrFunc);
        return regionSet(valueOrFunc);
    };
    typeof window === 'object' && window.addEventListener('storage', () => {
        const value = getLocalStorageState(key, fallbackValue);
        regionSet(value);
    });
    return region;
};

export default createLocalStorageRegion;
