const isExpired = ({ key, expiredTime, getFetchTimes }) => {
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ asyncFunction, forceUpdate, key, snapshot, id, expiredTime, getFetchTimes }) => {
  if (id !== undefined) {
    return Boolean(snapshot && snapshot[id] !== undefined);
  }
  return Boolean(
    expiredTime > 0 && typeof asyncFunction === 'function' && !forceUpdate && snapshot && !isExpired({ key, expiredTime, getFetchTimes }),
  );
};
