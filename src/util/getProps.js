export default (keys, loading, results, error) => {
  // TODO 是否要把 error: '' 给用户
  if (typeof keys === 'string') {
    const props = { loading, [keys]: results };
    if (error !== '') {
      props.error = error;
    }
    return props;
  }
  const props = { loading };
  if (error !== '') {
    props.error = error;
  }
  keys.forEach((key, index) => {
    props[key] = results[index];
  });
  return props;
};
