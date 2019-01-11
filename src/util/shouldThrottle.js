const isExpired = ({ key, expiredTime, getFetchTimes }) => {
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ asyncFunction, forceUpdate, key, snapshot, expiredTime, getFetchTimes }) => Boolean(typeof asyncFunction === 'function' && !forceUpdate && !isExpired({ key, expiredTime, getFetchTimes }) && snapshot);
