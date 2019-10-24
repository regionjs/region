
const mockDate = () => {
  /* eslint-disable no-global-assign, class-methods-use-this */
  // @ts-ignore
  Date = class {
    getHours() {
      return 0;
    }

    getMinutes() {
      return 0;
    }

    getSeconds() {
      return 0;
    }

    getMilliseconds() {
      return 0;
    }

    getTime() {
      return 0;
    }
  };
  /* eslint-enable no-global-assign, class-methods-use-this */
};

export default mockDate;
