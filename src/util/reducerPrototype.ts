function assignValue(state = {}, key, format) {
  const value = format(state[key]);
  return Object.assign({}, state, { [key]: value });
}

// NOTE 只支持 path.length === 2 和 format
export function assignValueDeep(state = {}, path, format) {
  const pathCopied = path.slice();
  const key = pathCopied.shift();
  const formatObj = {
    [key]: assignValue(state[key], pathCopied[0], format),
  };
  return Object.assign({}, state, formatObj);
}

// NOTE 只支持 path.length === 2 和 value
export function setValueDeep(state, path, value) {
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
}
