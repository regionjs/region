import { Region } from '../..';

describe('constructor', () => {
  test('with config', () => {
    const userRegion = new Region({ name: 'user' });
    expect(userRegion).toMatchSnapshot();
  });

  test('with string', () => {
    const followerRegion = new Region('follower');
    expect(followerRegion).toMatchSnapshot();
  });

  test('with undefined', () => {
    // @ts-ignore
    const globalRegion = new Region();
    expect(globalRegion).toMatchSnapshot();
  });
});
