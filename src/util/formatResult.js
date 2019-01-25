export const formatResult = ({ result, snapshot, format, error }) => {
  if (typeof format !== 'function') {
    return result;
  }
  return format(result, snapshot, error);
};
