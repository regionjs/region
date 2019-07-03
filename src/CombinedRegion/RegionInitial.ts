import { createStore, Store } from 'redux';
import { deprecate, getActionTypes, reducer } from '../util';
import { State, Action, Config, StrictConfig } from '../types';

class RegionInitial {
  name = '_';
  private_store: Store;
  private_actionTypes = getActionTypes('_');
  expiredTime = 0;
  enableLog = false;
  strictLoading = true;
  DefaultLoading?: any;
  DefaultError?: any;

  constructor(config: Config) {
    if (typeof config === 'object') {
      // TODO decide to fix it or not
      this.private_setConfig(config as StrictConfig);
    } else {
      this.private_setConfig({ name: config });
    }

    const { private_reducer } = this;
    this.private_store = createStore(private_reducer);
  }

  private_setConfig = (config: StrictConfig = {}): void => {
    const {
      name,
      expiredTime,
      enableLog,
      strictLoading,
      DefaultLoading,
      DefaultError,
    } = config;

    if (typeof name === 'string') {
      this.name = name;
      this.private_actionTypes = getActionTypes(name);
    }
    if (expiredTime !== undefined) {
      deprecate('expiredTime is deprecated. You can get fetchTime in getProps method to control your load function.');
      this.expiredTime = expiredTime;
    }
    if (enableLog !== undefined) {
      this.enableLog = enableLog;
    }
    if (strictLoading !== undefined) {
      deprecate('strictLoading is deprecated. set an initialValue to prevent it loading if you want to.');
      this.strictLoading = strictLoading;
    }
    if (DefaultLoading !== undefined) {
      deprecate('DefaultLoading is deprecated to make migration from connect to useProps fluently.');
      this.DefaultLoading = DefaultLoading;
    }
    if (DefaultError !== undefined) {
      deprecate('DefaultError is deprecated to make migration from connect to useProps fluently.');
      this.DefaultError = DefaultError;
    }
  }

  private_reducer = (state: State = {}, action: Action) => {
    const { enableLog, private_actionTypes } = this;
    // @ts-ignore
    const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
    return reducer(state, action, private_actionTypes, enableLogInDev);
  }
}

export default RegionInitial;
