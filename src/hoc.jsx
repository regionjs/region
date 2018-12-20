import React from 'react';
import { region } from './util/region';

const empty = () => null;

export default (DisplayComponent = empty, LoadingComponent = region.silentConnect ? empty : DisplayComponent) => {
  const ConnectWith = (props) => {
    const { loading } = props;
    return (loading ? <LoadingComponent {...props} /> : <DisplayComponent {...props} />);
  };
  return ConnectWith;
};
