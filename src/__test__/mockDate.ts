
const mockDate = () => {
    /* eslint-disable no-global-assign, class-methods-use-this */
    // @ts-expect-error
    Date = class {
        getTime() {
            return 0;
        }
    };
    /* eslint-enable no-global-assign, class-methods-use-this */
};

export default mockDate;
