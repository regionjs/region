import wrapSetConfig from './wrapSetConfig';
import wrapGet from './wrapGet';
import wrapMapResultToProps from './wrapMapResultToProps';
import wrapSet from './wrapSet';
import wrapLoad from './wrapLoad';
import wrapConnect from './wrapConnect';
import wrapReducer from './wrapReducer';

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default compose(
  wrapReducer,
  wrapConnect,
  wrapLoad,
  wrapSet,
  wrapMapResultToProps,
  wrapGet,
  wrapSetConfig
)();
