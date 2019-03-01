import '@babel/polyfill';

const noop = () => {};
const { log, warn, error } = console;
console.debug = noop;
console.log = () => log('console.log'); // eslint-disable-line no-console
console.warn = () => warn('console.warn');
console.error = () => error('console.error');
console.groupCollapsed = noop;
console.groupEnd = noop;
