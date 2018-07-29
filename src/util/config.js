export const config = {
  reducerPath: null,
  enableLog: true,
  expiredTime: 5 * 60 * 1000
};


export const setConfig = ({ reducerPath, expiredTime, enableLog }) => {
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
