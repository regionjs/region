import { debug, group } from '../util/logger';
import { setLoading, setResult } from '../util/constant';
import { assignValueDeep, setValueDeep } from '../util/reducerPrototype';

export default (RegionIn) => {
  class Region extends RegionIn {
    constructor() {
      super();
      this.reducer = this.reducer.bind(this);
    }

    reducer(state = {}, action) {
      const { enableLog, reducerPath } = this;
      const enableLogInDev = process.env.NODE_ENV !== 'production' && enableLog;
      if (action.type === setLoading) {
        const { key } = action.payload;
        if (enableLogInDev) {
          debug(`@${reducerPath}`, key);
        }
        return assignValueDeep(state, ['loadings', key], true);
      }
      if (action.type === setResult) {
        const { key, result } = action.payload;
        setValueDeep(state, ['results', key], result);
        setValueDeep(state, ['fetchTimes', key], new Date().getTime());
        const nextState = assignValueDeep(state, ['loadings', key], false);
        if (enableLogInDev) {
          group(`@${reducerPath}`, key, result, nextState);
        }
        return nextState;
      }
      return state;
    }
  }
  return Region;
};
