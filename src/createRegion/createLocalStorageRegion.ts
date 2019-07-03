import createRegion from './createRegion';

const localStorage = window && window.localStorage;

type Key = string;
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
    return JSON.parse(jsonString);
  } catch (e) {
    setLocalStorageState(key, fallbackValue);
    return fallbackValue;
  }
};

const createLocalStorageRegion = (key: Key, fallbackValue: Value) => {
  const region = createRegion(getLocalStorageState(key, fallbackValue));
  const regionSet = region.set;
  region.set = (valueOrFunc: any) => {
    if (typeof valueOrFunc === 'function') {
      const value = valueOrFunc(getLocalStorageState(key, fallbackValue));
      setLocalStorageState(key, value);
      regionSet(value);
      return;
    }
    setLocalStorageState(key, valueOrFunc);
    regionSet(valueOrFunc);
  };
  return region;
};

export default createLocalStorageRegion;
