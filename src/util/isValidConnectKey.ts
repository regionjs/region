import { LegacyKey } from '../types';

const isValidConnectKeyObject = (key: LegacyKey) => {
  if (key === null) return false;
  if (typeof key === 'function' || typeof key === 'object') {
    return 'loading' in key || 'result' in key || 'key' in key || 'selector' in key;
  }
  return false;
};

export const isValidConnectKey = (key: LegacyKey) => typeof key === 'string' || Array.isArray(key) || isValidConnectKeyObject(key);
