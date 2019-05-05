/**
 * TODO Warning: An update to User inside a test was not wrapped in act(...).
 */
const noop = () => {};
const { warn, error } = console;
console.debug = noop;
console.warn = () => warn('console.warn');
console.error = () => error('console.error');
console.groupCollapsed = noop;
console.groupEnd = noop;
