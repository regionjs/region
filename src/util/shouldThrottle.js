const isExpired = ({ key, expiredTime, getFetchTimes }) => {
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  console.log(now, fetchTime, expiredTime);
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ asyncFunction, forceUpdate, key, snapshot, expiredTime, getFetchTimes }) => {
  console.log(typeof asyncFunction === 'function', !forceUpdate, !isExpired({ key, expiredTime, getFetchTimes }), snapshot);
  return Boolean(typeof asyncFunction === 'function' && !forceUpdate && !isExpired({ key, expiredTime, getFetchTimes }) && snapshot);
};
