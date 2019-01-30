export default (keys, loading, results, error) => {
  // TODO 是否要把 error: '' 给用户
  if (typeof keys === 'string') {
    const props = { loading, error, [keys]: results };
    return props;
  }
  const props = { loading, error };
  keys.forEach((key, index) => {
    props[key] = results[index];
  });
  return props;
};
