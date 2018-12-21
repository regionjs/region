import { getFetchTimes, region } from './region';

const isExpired = (key) => {
  const { expiredTime } = region;
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ Promise, forceUpdate, key, snapshot }) => Boolean(typeof Promise === 'function' && !forceUpdate && !isExpired(key) && snapshot);
