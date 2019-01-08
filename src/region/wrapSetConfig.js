import { setStore } from '../global/store';

export default () => {
  class Region {
    constructor(config) {
      this.private_setConfig({
        name: null,
        expiredTime: 0,
        enableLog: true,
        strictLoading: true,
        silentConnect: false
      });
      if (config !== null && typeof config === 'object') {
        this.private_setConfig(config);
      } else {
        this.private_setConfig({ name: config });
      }
    }

    private_setConfig = (config = {}) => {
      const {
        name,
        reducerPath,
        expiredTime,
        enableLog,
        strictLoading,
        silentConnect
      } = config;

      if (name !== undefined) {
        this.name = name;
        this.SET_LOADING = name ? `@${name}/SET_LOADING` : '@region/SET_LOADING';
        this.SET_RESULT = name ? `@${name}/SET_RESULT` : '@region/SET_RESULT';
      }
      if (reducerPath !== undefined) {
        console.warn('reducerPath is deprecated, use name instead');
        this.name = reducerPath;
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
