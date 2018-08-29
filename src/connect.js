import { connect as rawConnect } from 'react-redux';
import { mapResultToProps } from './util/getThingsFromState';

export const connect = (mapStateToProps, mapDispatchToProps, mergeProps, options) => {
  if (typeof mapStateToProps === 'string' || Array.isArray(mapStateToProps)) {
    return rawConnect(mapResultToProps(mapStateToProps), mapDispatchToProps, mergeProps, options);
  }
  return rawConnect(mapStateToProps, mapDispatchToProps, mergeProps, options);
};
