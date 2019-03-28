import getActionTypes from '../util/getActionTypes';
import { State, Action, Config, StrictConfig } from '../types/interfaces';
import { injectStore } from '../global/store';
import { reducer } from '../util/reducer';

class RegionInitial {
  name = '_';
  private_actionTypes = getActionTypes('_');
  expiredTime = 0;
  enableLog = true;
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

    const { name, private_reducer } = this;
    injectStore(name, private_reducer);
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

    if (name !== undefined) {
      if (typeof name === 'string') {
        this.name = name;
      } else {
        console.error('Region name should be string');
      }
      this.private_actionTypes = getActionTypes(name);
    }
    if (expiredTime !== undefined) {
      this.expiredTime = expiredTime;
    }
    if (enableLog !== undefined) {
      this.enableLog = enableLog;
    }
    if (strictLoading !== undefined) {
      this.strictLoading = strictLoading;
    }
    if (DefaultLoading !== undefined) {
      this.DefaultLoading = DefaultLoading;
    }
    if (DefaultError !== undefined) {
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
