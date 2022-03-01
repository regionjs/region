import createRegion from './createRegion';

const localStorage = typeof window === 'object' && window.localStorage;

type LocalStorageKey = string;

const setLocalStorageState = <V>(key: LocalStorageKey, value: V) => {
    const jsonString = JSON.stringify(value);
    // JSON.stringify(undefined) === undefined
    // JSON.stringify(null) === 'null'
    if (typeof jsonString === 'string') {
        localStorage && localStorage.setItem(key, jsonString);
    } else {
        localStorage && localStorage.removeItem(key);
    }
};

const getLocalStorageState = <V>(key: LocalStorageKey, fallbackValue: V): V => {
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
    typeof window === 'object' && window.addEventListener('storage', () => {
        const value = getLocalStorageState(key, fallbackValue);
        regionSet(value);
    });
    return region;
};

export default createLocalStorageRegion;
