export const formatResult = ({ result, snapshot, format, error, id }) => {
  const formatted = typeof format === 'function' ? format(result, snapshot, error) : result;
  if (id !== undefined) {
    return Object.assign({ [id]: formatted }, snapshot);
  }
  return formatted;
};
