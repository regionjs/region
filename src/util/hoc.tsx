import * as React from 'react';
import { ComponentType } from '../types';

interface Params {
  Display?: ComponentType;
  Loading?: ComponentType;
  Error?: ComponentType;
  useProps?: any;
  key?: any;
}

export const hoc = ({ Display, Loading, Error, useProps, key }: Params) => {
  const ConnectWith = (ownProps: any) => {
    const props = useProps(key);
    const { loading, error } = props;
    if (loading) {
      return <Loading {...props} {...ownProps} />;
    }
    if (error) {
      return <Error {...props} {...ownProps} />;
    }
    return <Display {...props} {...ownProps} />;
  };
  return ConnectWith;
};
