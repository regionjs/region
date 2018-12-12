export const region = {
  store: null,
  reducerPath: null,
  enableLog: true,
  expiredTime: 5 * 60 * 1000,
  strictLoading: true,
  silentConnect: false
};

export const setConfig = (config = {}) => {
  const {
    store,
    reducerPath,
    expiredTime,
    enableLog,
    strictLoading,
    silentConnect
  } = config;

  if (store !== undefined) {
    region.store = store;
  }
  if (reducerPath !== undefined) {
    region.reducerPath = reducerPath;
  }
  if (expiredTime !== undefined) {
    region.expiredTime = expiredTime;
  }
  if (enableLog !== undefined) {
    region.enableLog = enableLog;
  }
  if (strictLoading !== undefined) {
    region.strictLoading = strictLoading;
  }
  if (silentConnect !== undefined) {
    region.silentConnect = silentConnect;
  }
};
