import getActionTypes from '../util/getActionTypes';
import { Config } from '../types/interfaces';

export default (): any => {
  class Region {
    name?: string | null;
    private_actionTypes?: object;
    expiredTime?: number;
    enableLog?: boolean;
    strictLoading?: boolean;
    DefaultLoading?: any;
    DefaultError?: any;

    constructor(config: Config) {
      this.private_setConfig({
        name: null,
        expiredTime: 0,
        enableLog: true,
        strictLoading: true,
      });
      if (config !== null && typeof config === 'object') {
        this.private_setConfig(config);
      } else {
        // TODO decide to fix it or not
        this.private_setConfig({ name: config } as Config);
      }
    }

    private_setConfig = (config: Config = {}): void => {
      const {
        name,
        expiredTime,
        enableLog,
        strictLoading,
        DefaultLoading,
        DefaultError,
      } = config;

      if (name !== undefined) {
        this.name = name;
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
  }
  return Region;
};
