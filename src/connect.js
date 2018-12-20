import { connect as rawConnect } from 'react-redux';
import { mapResultToProps } from './util/region';
import hoc from './hoc';
import { isValidConnectKey } from './util/isValidConnectKey';

export const connectWith = (key, DisplayComponent, LoadingComponent) => {
  if (isValidConnectKey(key)) {
    const WrapperComponent = hoc(DisplayComponent, LoadingComponent);
    return rawConnect(mapResultToProps(key))(WrapperComponent);
  }
  console.warn('key should be string or array of string');
  return rawConnect(key)(DisplayComponent);
};
