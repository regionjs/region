interface Params {
  result?: any;
  snapshot?: any;
  format?: any;
  error?: any;
  id?: any;
}

export const formatResult = ({ result, snapshot, format, error, id }: Params) => {
  const formatted = typeof format === 'function' ? format(result, snapshot, error) : result;
  if (id !== undefined) {
    return Object.assign({ [id]: formatted }, snapshot);
  }
  return formatted;
};
