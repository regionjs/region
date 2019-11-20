import { State } from '../types';

// NOTE only support path.length === 2, 3 and value
export const setValueDeep = (state: State, path: any, value: any) => {
  let obj = state;
  let i;
  for (i = 0; i < path.length - 1; i += 1) {
    if (obj[path[i]] === undefined) {
      obj[path[i]] = {};
    }
    obj = obj[path[i]];
  }
  if (typeof value === 'function') {
    obj[path[i]] = value(obj[path[i]]);
  } else {
    obj[path[i]] = value;
  }
  return null;
};
