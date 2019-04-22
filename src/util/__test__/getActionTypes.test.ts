import getActionTypes from '../getActionTypes';

describe('getActionTypes', () => {
  test('getActionTypes', () => {
    // @ts-ignore
    expect(getActionTypes()).toMatchSnapshot();
    expect(getActionTypes('name')).toMatchSnapshot();
  });
});
