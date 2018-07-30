const config = {
  reducerPath: null,
  enableLog: true,
  expiredTime: 5 * 60 * 1000
};

export default config;

export const setConfig = (configObj = {}) => {
  const { reducerPath, expiredTime, enableLog } = configObj;
  if (reducerPath !== undefined) {
    config.reducerPath = reducerPath;
  }
  if (expiredTime !== undefined) {
    config.expiredTime = expiredTime;
  }
  if (enableLog !== undefined) {
    config.enableLog = enableLog;
  }
};
