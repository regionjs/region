import wrapSetConfig from './wrapSetConfig';
import wrapReducer from './wrapReducer';
import wrapGet from './wrapGet';
import wrapPrivate from './wrapPrivate';
import wrapPublic from './wrapPublic';
import wrapReact from './wrapReact';

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg);

export default compose(
  wrapReact,
  wrapPublic,
  wrapPrivate,
  wrapGet,
  wrapReducer,
  wrapSetConfig,
)();
