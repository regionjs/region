export const isAsync = (asyncFunction: any) => {
  if (asyncFunction && typeof asyncFunction === 'object' && typeof asyncFunction.then === 'function') {
    return true;
  }
  return typeof asyncFunction === 'function';
};
