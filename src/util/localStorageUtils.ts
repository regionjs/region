const localStorage = typeof window === 'object' && window.localStorage;

type LocalStorageKey = string;

export const setLocalStorageState = (key: LocalStorageKey, jsonString: string | undefined) => {
    // istanbul ignore next - only used in browser
    if (!localStorage) {
        return;
    }
    // JSON.stringify(undefined) === undefined
    // JSON.stringify(null) === 'null'
    if (typeof jsonString === 'string') {
        localStorage.setItem(key, jsonString);
    } else {
        localStorage.removeItem(key);
    }
};

export const getLocalStorageState = (key: LocalStorageKey): string | null => {
    // istanbul ignore next - only used in browser
    if (!localStorage) {
        return null;
    }
    const jsonString = localStorage.getItem(key);
    return jsonString;
};

export const parseLocalStorageState = <V>(jsonString: string | null, fallbackValue: V): V => {
    try {
        if (jsonString === null) {
            // when jsonString === null => item is undefined
            // when jsonString === 'null' => item is null
            return fallbackValue;
        }
        return JSON.parse(jsonString);
    } catch (e) {
        return fallbackValue;
    }
};
