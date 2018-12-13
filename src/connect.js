import { connect as rawConnect } from 'react-redux';
import { mapResultToProps } from './util/getThingsFromState';
import hoc from './hoc';

const isValidKeyObject = (key) => {
  if (key === null) return false;
  if (typeof key === 'function' || typeof key === 'object') {
    return 'loading' in key || 'result' in key || 'entity' in key || 'selector' in key;
  }
  return false;
};

export const connectWith = (key, DisplayComponent, LoadingComponent) => {
  if (typeof key === 'string' || Array.isArray(key) || isValidKeyObject(key)) {
    const WrapperComponent = hoc(DisplayComponent, LoadingComponent);
    return rawConnect(mapResultToProps(key))(WrapperComponent);
  }
  console.warn('key should be string or array of string');
  return rawConnect(key)(DisplayComponent);
};
