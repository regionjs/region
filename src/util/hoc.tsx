import * as React from 'react';
import { Props } from '../types/interfaces';
import { ComponentType } from '../types/types';

export const prehoc = (Display: ComponentType, Loading: ComponentType, Error: ComponentType) => {
  const ConnectWith = (props: Props) => {
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
