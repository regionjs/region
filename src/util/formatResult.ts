interface Params {
  result?: any;
  snapshot?: any;
  format?: any;
  id?: any;
}

export const formatResult = ({ result, snapshot, format, id }: Params) => {
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  if (id !== undefined) {
    return Object.assign({ [id]: formatted }, snapshot);
  }
  return formatted;
};
