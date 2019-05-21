import { FormatResultParams, FormatResultWithIdParams } from '../types';

export const formatResult = ({ result, snapshot, format }: FormatResultParams) => {
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  return formatted;
};

export const formatResultWithId = ({ result, snapshot, format, id }: FormatResultWithIdParams) => {
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  // NOTE should return a different object or useProps may? broke
  return Object.assign({}, snapshot, { [id]: formatted });
};
