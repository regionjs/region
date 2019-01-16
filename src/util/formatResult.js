export const formatResult = ({ result, snapshot, format }) => {
  if (typeof format !== 'function') {
    return result;
  }
  return format(result, snapshot);
};
