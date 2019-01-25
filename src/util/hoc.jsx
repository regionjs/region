import React from 'react';

export default (Display, Loading, Error) => {
  const ConnectWith = (props) => {
    const { loading, error } = props;
    if (loading) {
      return <Loading {...props} />;
    }
    if (error) {
      return <Error {...props} />;
    }
    return <Display {...props} />;
  };
  return ConnectWith;
};
