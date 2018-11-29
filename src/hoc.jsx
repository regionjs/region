import React from 'react';
import { silentConnect } from './util/config';

const empty = () => null;

export default (DisplayComponent = empty, LoadingComponent = silentConnect ? empty : DisplayComponent) => {
  const ConnectWith = (props) => {
    const { loading } = props;
    return (loading ? <LoadingComponent {...props} /> : <DisplayComponent {...props} />);
  };
  return ConnectWith;
};
