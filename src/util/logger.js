const repeat = (str, times) => (new Array(times + 1)).join(str);

const pad = (num, maxLength) => repeat('0', maxLength - num.toString().length) + num;

const formatTime = time => `${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`;

const factory = (logger) => (...args) => {
  let formatString = '';
  const styles = [];
  let i;
  for (i = 0; i < args.length; i++) {
    formatString += ` %c${args[i]}`;
    const style = i % 2 === 0 ? 'color: gray; font-weight: lighter;' : 'font-weight: bold';
    styles.push(style);
  }
  formatString += ` %c@ ${formatTime(new Date())}`;
  styles.push('color: gray; font-weight: lighter;');
  logger(formatString, ...styles);
};

export const debug = factory(console.debug);
export const group = factory(console.groupCollapsed);
export const groupEnd = console.groupEnd; // eslint-disable-line prefer-destructuring
