import { setReducerPath } from './util/getThingsFromState';
import { setEnableLog } from './reducer';
import { setExpiredTime } from './load';

export const setConfig = ({ reducerPath, expiredTime, enableLog }) => {
  setReducerPath(reducerPath);
  setExpiredTime(expiredTime);
  setEnableLog(enableLog);
};
