import { region } from './region';
import { groupError } from './logger';

export const getStore = () => {
  const { store } = region;
  if (!store || typeof store.dispatch !== 'function' || typeof store.getState !== 'function') {
    throw Error('setConfig({ store }) must be called');
  }
  return store;
};

export const formatResult = ({ result, snapshot, key, format }) => {
  if (typeof format !== 'function') {
    return result;
  }
  try {
    const formattedResult = format(result, snapshot);
    return formattedResult;
  } catch (e) {
    groupError(`Catch an error when format ${key}, return null instead.`, e);
    return null;
  }
};
