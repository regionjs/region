import * as React from 'react';

export const prehoc = (Display, Loading, Error) => {
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

interface Params {
    Display?: any,
    Loading?: any,
    Error?: any,
    useProps?: any,
    key?: any
}

export default ({ Display, Loading, Error, useProps, key }: Params) => {
  const ConnectWith = (ownProps) => {
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
