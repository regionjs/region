export const formatResult = ({ result, snapshot, format }) => {
  if (typeof format !== 'function') {
    return result;
  }
  const formattedResult = format(result, snapshot);
  return formattedResult;
};
