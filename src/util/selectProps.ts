export default (keys, loading, results, error) => {
  // TODO migrate selectProps
  // 可以在这里做更多的事情，把合并的过程放在这里，因为 getFunctions 已经是 private 的了，这样就不用考虑【是否要把 error: '' 给用户】
  // 同时可以把 fetchTime 放在这里
  // 但是为了用户友好，在下个大版本做这个
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
