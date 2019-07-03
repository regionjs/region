import { CombinedRegion } from '../..';

describe('constructor', () => {
  test('with config', () => {
    const userRegion = new CombinedRegion({ name: 'user' });
    expect(userRegion).toBeInstanceOf(CombinedRegion);
  });

  test('with string', () => {
    const followerRegion = new CombinedRegion('follower');
    expect(followerRegion).toBeInstanceOf(CombinedRegion);
  });

  test('with undefined', () => {
    // @ts-ignore
    const globalRegion = new CombinedRegion();
    expect(globalRegion).toBeInstanceOf(CombinedRegion);
  });
});
