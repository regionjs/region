import * as React from 'react';
import { Props } from '../types';

interface HocParams {
  Component: any;
  alias: string;
  useProps: any;
}

export const hoc = ({ Component, alias = 'value', useProps }: HocParams) => {
  const Connect = (ownProps: Props) => {
    const props = useProps();
    props[alias] = props.value;
    return <Component {...props} {...ownProps} />;
  };
  return Connect;
};
