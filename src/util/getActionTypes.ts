import { Name } from '../types/types';
type Type = 'LOAD' | 'SET' | 'RESET';

const generator = (name: Name, type: Type) => (name ? `@${name}/${type}` : `@region/${type}`);

export default (name: Name) => ({
  LOAD: generator(name, 'LOAD'),
  SET: generator(name, 'SET'),
  RESET: generator(name, 'RESET'),
});
