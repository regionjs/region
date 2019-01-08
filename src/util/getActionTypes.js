const generator = (name, type) => (name ? `@${name}/${type}` : `@region/${type}`);

export default (name) => ({
  LOAD_START: generator(name, 'LOAD_START'),
  LOAD_END: generator(name, 'LOAD_END'),
  SET: generator(name, 'SET'),
  ERROR: generator(name, 'ERROR'),
});
