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

export default ({ Display, Loading, Error, useProps, key }) => {
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
