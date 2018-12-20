import RegionInitial from './RegionInitial';
import wrapSetConfig from './wrapSetConfig';
import wrapGet from './wrapGet';
import wrapMapResultToProps from './wrapMapResultToProps';

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default compose(
  wrapMapResultToProps,
  wrapGet,
  wrapSetConfig
)(RegionInitial);
