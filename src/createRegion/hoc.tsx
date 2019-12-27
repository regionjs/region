import * as React from 'react';

interface HocParams {
  Component: any;
  alias: string;
  useProps: any;
}

export const hoc = ({ Component, alias = 'value', useProps }: HocParams) => {
  const Connect = (ownProps: any) => {
    const props = useProps();
    props[alias] = props.value;
    return <Component {...props} {...ownProps} />;
  };
  return Connect;
};
