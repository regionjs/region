import * as React from 'react';
import { Props } from '../types/interfaces';
import { ComponentType } from '../types/types';

interface Params {
  Display?: ComponentType;
  Loading?: ComponentType;
  Error?: ComponentType;
  useProps?: any;
  key?: any;
}

export default ({ Display, Loading, Error, useProps, key }: Params) => {
  const ConnectWith = (ownProps: Props) => {
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
