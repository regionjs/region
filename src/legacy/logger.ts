const formatTime = (time: Date) => {
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const second = time.getSeconds().toString().padStart(2, '0');
  const millisecond = time.getMilliseconds().toString().padStart(3, '0');
  return `${hour}:${minute}:${second}.${millisecond}`;
};

const getFormat = (prefix: string, str: string) => {
  const formatString = ` %c${prefix} %c${str} %c@ ${formatTime(new Date())}`;
  return [formatString, 'color: gray; font-weight: lighter;', 'font-weight: bold', 'color: gray; font-weight: lighter;'];
};

export const debug = (prefix: string, str: string) => console.debug(...getFormat(prefix, str));

interface Param {
  actionType: string;
  key: string;
  result?: any;
  error?: any;
  nextState?: any;
}

export const group = ({ actionType, key, result, error, nextState }: Param) => {
  console.groupCollapsed(...getFormat(actionType, key));
  console.debug('%cresult    ', 'color: #03A9F4; font-weight: bold', result);
  console.debug('%cerror     ', 'color: #f5222d; font-weight: bold', error);
  console.debug('%cnext state', 'color: #4CAF50; font-weight: bold', nextState);
  console.groupEnd();
};
