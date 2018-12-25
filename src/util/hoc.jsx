import React from 'react';

export default (DisplayComponent, LoadingComponent) => {
  const ConnectWith = (props) => {
    const { loading } = props;
    return (loading ? <LoadingComponent {...props} /> : <DisplayComponent {...props} />);
  };
  return ConnectWith;
};
