// import { region } from './region';
import { groupError } from './logger';

// export const { getStore } = region;

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
