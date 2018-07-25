const repeat = (str, times) => (new Array(times + 1)).join(str);

const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

const factory = (logger) => (prefix, str) => {
  const formatString = ` %c${prefix} %c${str} %c@ ${formatTime(new Date())}`;
  logger(formatString, 'color: gray; font-weight: lighter;', 'font-weight: bold', 'color: gray; font-weight: lighter;');
};

export const debug = factory(console.debug);
export const group = (prefix, str, result, nextState) => {
  factory(console.groupCollapsed)(prefix, str);
  console.debug('%cresult    ', 'color: #03A9F4; font-weight: bold', result);
  console.debug('%cnext state', 'color: #4CAF50; font-weight: bold', nextState);
  console.groupEnd();
};
