import { assignValueDeep, setValueDeep } from './reducerPrototype';
import { debug, group } from './logger';

const setKey = ({ state, key, fetchTime, result, error, withLoadEnd }: any) => {
  setValueDeep(state, ['fetchTimes', key], fetchTime);
  if (result !== undefined) {
    setValueDeep(state, ['results', key], result);
  }
  setValueDeep(state, ['errors', key], error); // as well error ===  undefined
  const nextState = assignValueDeep(state, ['loadings', key], withLoadEnd ? (v = 0) => v - 1 : (v = 0) => v);
  return nextState;
};

export const reducer = (state: any, action: any, actionTypes: any, enableLogInDev?: boolean) => {
  const { LOAD, SET, RESET } = actionTypes;
  switch (action.type) {
    case LOAD: {
      const { key } = action.payload;
      if (enableLogInDev) {
        debug(LOAD, key);
      }
      return assignValueDeep(state, ['loadings', key], (v = 0) => v + 1);
    }
    case SET: {
      const { key, result, error, withLoadEnd } = action.payload;
      const fetchTime = new Date().getTime();
      const nextState = setKey({ state, key, fetchTime, result, error, withLoadEnd });
      if (enableLogInDev) {
        if (error) {
          console.error(error.message);
        }
        group({ actionType: SET, key, result, error, nextState });
      }
      return nextState;
    }
    case RESET: {
      return {};
    }
    default: {
      return state;
    }
  }
};
