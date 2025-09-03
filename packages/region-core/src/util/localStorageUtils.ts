type LocalStorageKey = string;

export const setLocalStorageState = (key: LocalStorageKey, jsonString: string | undefined) => {
    // JSON.stringify(undefined) === undefined
    // JSON.stringify(null) === 'null'
    if (typeof jsonString === 'string') {
        localStorage.setItem(key, jsonString);
    }
    else {
        localStorage.removeItem(key);
    }
};

export const getLocalStorageState = (key: LocalStorageKey): string | null => {
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
    }
    catch (_) {
        return fallbackValue;
    }
};
