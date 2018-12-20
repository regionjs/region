const isValidConnectKeyObject = (key) => {
  if (key === null) return false;
  if (typeof key === 'function' || typeof key === 'object') {
    return 'loading' in key || 'result' in key || 'entity' in key || 'selector' in key;
  }
  return false;
};

export const isValidConnectKey = (key) => typeof key === 'string' || Array.isArray(key) || isValidConnectKeyObject(key);
