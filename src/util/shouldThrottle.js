const isExpired = ({ key, region }) => {
  if (!region) {
    return true;
  }
  // TODO lift up
  const { expiredTime, getFetchTimes } = region;
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ Promise, forceUpdate, key, snapshot, region }) => Boolean(typeof Promise === 'function' && !forceUpdate && !isExpired({ key, region }) && snapshot);
