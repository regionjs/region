import { createRegion } from '..';

describe('reject race condition', () => {
  test('basic', (done) => {
    const region = createRegion();
    const throwError = () => new Promise((resolve, reject) => {
      setTimeout(() => reject('error'), 0);
    });

    region.load(throwError);

    expect(region.getError()?.message).toBe(undefined);
    setTimeout(
      () => {
        expect(region.getLoading()).toBe(false);
        expect(region.getError()?.message).toBe('error');
        done();
      },
      50,
    );
  });

  test('race', (done) => {
    const region = createRegion();
    const throwError = () => new Promise((resolve, reject) => {
      setTimeout(() => reject('error'), 0);
    });

    const resolve1 = () => new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 100);
    });

    region.load(throwError);
    region.load(resolve1);

    expect(region.getError()?.message).toBe(undefined);
    setTimeout(
      () => {
        expect(region.getLoading()).toBe(true);
        expect(region.getError()?.message).toBe(undefined);
        done();
      },
      50,
    );
  });
});
