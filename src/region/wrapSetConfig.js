import { setStore } from '../global/store';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.setConfig = this.setConfig.bind(this);
    }

    setConfig(config = {}) {
      const {
        store,
        reducerPath,
        expiredTime,
        enableLog,
        strictLoading,
        silentConnect
      } = config;

      if (store !== undefined) {
        setStore(store);
      }
      if (reducerPath !== undefined) {
        this.reducerPath = reducerPath;
        this.SET_LOADING = `@${reducerPath}/SET_LOADING`;
        this.SET_RESULT = `@${reducerPath}/SET_RESULT`;
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
  }
  return Region;
};
