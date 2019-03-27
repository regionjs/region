interface IsExpiredParams {
  key?: any;
  expiredTime?: any;
  getFetchTimes?: any;
}

interface Params {
  asyncFunction?: any;
  forceUpdate?: any;
  key?: any;
  snapshot?: any;
  id?: any;
  expiredTime?: any;
  getFetchTimes?: any;
}

const isExpired = ({ key, expiredTime, getFetchTimes }: IsExpiredParams) => {
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ asyncFunction, forceUpdate, key, snapshot, id, expiredTime, getFetchTimes }: Params) => {
  if (id !== undefined) {
    return Boolean(snapshot && snapshot[id] !== undefined);
  }
  return Boolean(
    expiredTime > 0 && typeof asyncFunction === 'function' && !forceUpdate && snapshot && !isExpired({ key, expiredTime, getFetchTimes }),
  );
};
