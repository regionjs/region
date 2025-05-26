const noop = () => {};
// TODO spy on console.error
/* eslint-disable no-console */
console.debug = noop;
console.warn = noop;
console.error = noop;
console.groupCollapsed = noop;
console.groupEnd = noop;
/* eslint-enable no-console */
