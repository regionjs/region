const isValidConnectKeyObject = (key) => {
  if (key === null) return false;
  if (typeof key === 'function' || typeof key === 'object') {
    if ('entity' in key) {
      console.warn('entity is deprecated, use entity instead');
    }
    return 'loading' in key || 'result' in key || 'key' in key || 'selector' in key;
  }
  return false;
};

export const isValidConnectKey = key => typeof key === 'string' || Array.isArray(key) || isValidConnectKeyObject(key);
