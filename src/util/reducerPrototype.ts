type State = {[key: string]: any};

const assignValue = (state: State = {}, key: string, format: any) => {
  const value = format(state[key]);
  return Object.assign({}, state, { [key]: value });
};

// NOTE 只支持 path.length === 2 和 format
export const assignValueDeep = (state: State = {}, path: any, format: any) => {
  const pathCopied = path.slice();
  const key = pathCopied.shift();
  const formatObj = {
    [key]: assignValue(state[key], pathCopied[0], format),
  };
  return Object.assign({}, state, formatObj);
};

// NOTE 只支持 path.length === 2 和 value
export const setValueDeep = (state: State, path: any, value: any) => {
  let obj = state;
  let i;
  for (i = 0; i < path.length - 1; i += 1) {
    if (obj[path[i]] === undefined) {
      obj[path[i]] = {};
    }
    obj = obj[path[i]];
  }
  obj[path[i]] = value;
  return null;
};
