import { Region } from '../..';

describe('constructor', () => {
  test('with config', () => {
    const userRegion = new Region({ name: 'user' });
    expect(userRegion).toBeInstanceOf(Region);
  });

  test('with string', () => {
    const followerRegion = new Region('follower');
    expect(followerRegion).toBeInstanceOf(Region);
  });

  test('with undefined', () => {
    // @ts-ignore
    const globalRegion = new Region();
    expect(globalRegion).toBeInstanceOf(Region);
  });
});
