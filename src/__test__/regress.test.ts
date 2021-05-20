import { createRegion } from '..';

describe('reject race condition', () => {
  test('basic', (done) => {
    const region = createRegion();
    const throwError = () => new Promise((resolve, reject) => {
      setTimeout(() => reject('error'), 0);
    });

    region.loadBy(throwError)();

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

    const resolve1 = () => new Promise((resolve) => {
      setTimeout(() => resolve(1), 100);
    });

    region.loadBy(throwError)();
    region.loadBy(resolve1)();

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

  test('acceptEvery', (done) => {
    const region = createRegion(undefined, { strategy: 'acceptEvery' });
    const throwError = () => new Promise((resolve, reject) => {
      setTimeout(() => reject('error'), 0);
    });

    const resolve1 = () => new Promise((resolve) => {
      setTimeout(() => resolve(1), 100);
    });

    region.loadBy(throwError)();
    region.loadBy(resolve1)();

    expect(region.getError()?.message).toBe(undefined);
    setTimeout(
      () => {
        expect(region.getLoading()).toBe(true);
        expect(region.getError()?.message).toBe('error');
        done();
      },
      50,
    );
  });
});

describe('bypass error when error should not be combined', () => {
  test('basic', (done) => {
    const region = createRegion();
    const throwError = () => new Promise((resolve, reject) => {
      const error = new Error('error');
      // @ts-ignore
      error.a = 1;
      setTimeout(() => reject(error), 0);
    });

    region.loadBy(throwError)();
    expect(region.getError()?.message).toBe(undefined);

    setTimeout(
      () => {
        expect(region.getError()?.message).toBe('error');
        // @ts-ignore
        expect(region.getError()?.a).toBe(1);
        done();
      },
      50,
    );
  });
});
