import { getFetchTimes, region } from './region';

const isExpired = (key) => {
  const { expiredTime } = region;
  const fetchTime = getFetchTimes(key);
  const now = new Date().getTime();
  return now - fetchTime > expiredTime;
};

export const shouldThrottle = ({ forceUpdate, key, snapshot }) => Boolean(!forceUpdate && !isExpired(key) && snapshot);
