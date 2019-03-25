const isValidConnectKeyObject = (key: any) => {
  if (key === null) return false;
  if (typeof key === 'function' || typeof key === 'object') {
    return 'loading' in key || 'result' in key || 'key' in key || 'selector' in key;
  }
  return false;
};

export const isValidConnectKey = (key: any) => typeof key === 'string' || Array.isArray(key) || isValidConnectKeyObject(key);
