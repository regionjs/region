import RegionInitial from './RegionInitial';
import wrapSetConfig from './wrapSetConfig';
import wrapGet from './wrapGet';
import wrapMapResultToProps from './wrapMapResultToProps';
import wrapSet from './wrapSet';
import wrapLoad from './wrapLoad';

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default compose(
  wrapLoad,
  wrapSet,
  wrapMapResultToProps,
  wrapGet,
  wrapSetConfig
)(RegionInitial);
