import { setStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor(config) {
      super(config);
      this.private_setConfig(config);
    }

    private_setConfig = (config = {}) => {
      const {
        reducerPath,
        expiredTime,
        enableLog,
        strictLoading,
        silentConnect
      } = config;

      if (reducerPath !== undefined) {
        this.reducerPath = reducerPath;
        this.SET_LOADING = reducerPath ? `@${reducerPath}/SET_LOADING` : '@region/SET_LOADING';
        this.SET_RESULT = reducerPath ? `@${reducerPath}/SET_RESULT` : '@region/SET_RESULT';
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
      if (silentConnect !== undefined) {
        this.silentConnect = silentConnect;
      }
    }

    setConfig = (config = {}) => {
      console.warn('setConfig is deprecated, use private_setConfig instead');
      const { private_setConfig } = this;
      const { store } = config;

      if (store !== undefined) {
        console.warn('setStore in setConfig is deprecated, use getProvider or setStore instead');
        setStore(store);
      }
      private_setConfig(config);
    }
  }
  return Region;
};
