const wrapSetConfig = (RegionIn) => {
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
        this.store = store;
      }
      if (reducerPath !== undefined) {
        this.reducerPath = reducerPath;
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

export default wrapSetConfig;
