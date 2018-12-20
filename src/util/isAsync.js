export const isAsync = (Promise) => {
  if (Promise && typeof Promise === 'object' && typeof Promise.then === 'function') {
    return true;
  }
  return typeof Promise === 'function';
};
