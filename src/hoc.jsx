import React from 'react';

export default (DisplayComponent, LoadingComponent) => ({ loading, ...rest }) => (loading ? <LoadingComponent {...rest} /> : <DisplayComponent {...rest} />);
