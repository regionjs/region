const repeat = (str, times) => (new Array(times + 1)).join(str); // tslint:disable-line prefer-array-literal

const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

const getFormat = (prefix, str) => {
  const formatString = ` %c${prefix} %c${str} %c@ ${formatTime(new Date())}`;
  return [formatString, 'color: gray; font-weight: lighter;', 'font-weight: bold', 'color: gray; font-weight: lighter;'];
};

export const debug = (prefix, str) => console.debug(...getFormat(prefix, str));

interface Param {
  actionType?: any,
  key?: any,
  result?: any,
  error?: any,
  nextState?: any
}

export const group = ({ actionType, key, result, error, nextState }: Param) => {
  console.groupCollapsed(...getFormat(actionType, key));
  console.debug('%cresult    ', 'color: #03A9F4; font-weight: bold', result);
  console.debug('%cerror     ', 'color: #f5222d; font-weight: bold', error);
  console.debug('%cnext state', 'color: #4CAF50; font-weight: bold', nextState);
  console.groupEnd();
};
