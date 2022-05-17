const localStorage = typeof window === 'object' && window.localStorage;

type LocalStorageKey = string;

export const setLocalStorageState = <V>(key: LocalStorageKey, value: V) => {
    const jsonString = JSON.stringify(value);
    // JSON.stringify(undefined) === undefined
    // JSON.stringify(null) === 'null'
    if (typeof jsonString === 'string') {
        localStorage && localStorage.setItem(key, jsonString);
    } else {
        localStorage && localStorage.removeItem(key);
    }
};

export const getLocalStorageState = <V>(key: LocalStorageKey, fallbackValue: V): V => {
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
