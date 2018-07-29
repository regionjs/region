/* eslint-disable no-param-reassign */

export function assignValue(state, key, value) {
  const obj = { [key]: value };
  return Object.assign({}, state, obj);
}

/**
 * assignValueDeep
 * @param {Object} state
 * @param {Array|string} pathOrigin
 * @param {*} value - value assign to path
 * @returns {Object} - state
 */
export function assignValueDeep(state = {}, pathOrigin, value) {
  if (!pathOrigin) {
    console.warn('empty path invalid');
    return Object.assign({}, state, value);
  }
  if (!Array.isArray(pathOrigin)) {
    return assignValue(state, pathOrigin, value);
  }
  if (pathOrigin.length === 0) {
    console.warn('empty path invalid');
    return Object.assign({}, state, value);
  }
  if (pathOrigin.length === 1) {
    return assignValue(state, pathOrigin[0], value);
  }
  const path = pathOrigin.slice();
  const key = path.shift();
  const formatObj = {
    [key]: assignValueDeep(state[key], path, value)
  };
  return Object.assign({}, state, formatObj);
}

/**
 * setValueDeep
 * @param {Object} state
 * @param {Array|string} path
 * @param {*} value - value assign to path
 * @returns null
 */
export function setValueDeep(state = {}, path, value) {
  if (!path) {
    console.warn('empty path invalid');
    Object.assign(state, value);
    return null;
  }
  if (!Array.isArray(path)) {
    state[path] = value;
    return null;
  }
  if (path.length === 0) {
    console.warn('empty path invalid');
    Object.assign(state, value);
    return null;
  }
  if (path.length === 1) {
    state[path] = value;
    return null;
  }

  let obj = state;
  let i;
  for (i = 0; i < path.length - 1; i++) {
    if (obj[path[i]] === undefined) {
      obj[path[i]] = {};
    }
    obj = obj[path[i]];
  }
  obj[path[i]] = value;
  return null;
}
