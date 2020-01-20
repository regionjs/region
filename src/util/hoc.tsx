import * as React from 'react';

interface Params {
  Display?: any;
  Loading?: any;
  Error?: any;
  useProps?: any;
  key?: any;
}

type Hoc = (params: Params) => React.FC<any>;

export const hoc: Hoc = ({ Display, Loading, Error, useProps, key }) => {
  const ConnectWith: React.FC<any> = (ownProps: any) => {
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
