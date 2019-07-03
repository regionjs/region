import { Name } from '../types';
type Type = 'LOAD' | 'SET' | 'RESET';

const generator = (name: Name, type: Type) => `@${name}/${type}`;

export const getActionTypes = (name: Name = 'region') => ({
  LOAD: generator(name, 'LOAD'),
  SET: generator(name, 'SET'),
  RESET: generator(name, 'RESET'),
});
