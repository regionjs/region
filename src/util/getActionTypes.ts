import { Name } from '../types';
type Type = 'LOAD' | 'SET' | 'RESET';

const generator = (name: Name, type: Type) => (name ? `@${name}/${type}` : `@region/${type}`);

export const getActionTypes = (name: Name) => ({
  LOAD: generator(name, 'LOAD'),
  SET: generator(name, 'SET'),
  RESET: generator(name, 'RESET'),
});
