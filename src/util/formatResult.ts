interface Params {
  result?: any;
  snapshot?: any;
  format?: any;
  id?: any;
}

export const formatResult = ({ result, snapshot, format, id }: Params) => {
  const formatted = typeof format === 'function' ? format(result, snapshot) : result;
  if (id !== undefined) {
    // NOTE should return a different object or useProps may? broke
    return Object.assign({}, snapshot, { [id]: formatted });
  }
  return formatted;
};
