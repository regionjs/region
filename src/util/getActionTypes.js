const generator = (name, type) => (name ? `@${name}/${type}` : `@region/${type}`);

export default name => ({
  LOAD_START: generator(name, 'LOAD'),
  SET: generator(name, 'SET'),
});
