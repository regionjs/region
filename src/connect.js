import { connect as rawConnect } from 'react-redux';
import { mapResultToProps } from './util/getThingsFromState';
import hoc from './hoc';

export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  console.warn('connect is deprecated, use connectWith instead');
  if (typeof mapStateToProps === 'string' || Array.isArray(mapStateToProps)) {
    return rawConnect(mapResultToProps(mapStateToProps), mapDispatchToProps, mergeProps, options);
  }
  return rawConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
};

export const connectWith = (key, DisplayComponent, LoadingComponent) => { // eslint-disable-line
  if (typeof key === 'string' || Array.isArray(key)) {
    const WrapperComponent = hoc(DisplayComponent, LoadingComponent);
    return rawConnect(mapResultToProps(key))(WrapperComponent);
  }
  console.warn('key should be string or array of string');
  return rawConnect(key)(DisplayComponent);
};
