import { region } from './region';

describe('effect', () => {
  test('1 + 1', () => {
    region.unstable_effect(['a', 'b'], 'sum', ({ a, b }: any) => a + b);

    region.set('a', 1);
    const mid = region.getProps('sum');
    expect(mid.sum).toBe(undefined); // b is loading

    region.set('b', 1);
    const final = region.getProps('sum');
    expect(final.sum).toBe(2);
  });

  test('forward loading', async () => {
    const promise = region.load('a', Promise.resolve(2));
    const pending = region.getProps('sum');
    expect(pending.loading).toBe(true);
    expect(pending.sum).toBe(2);
    await promise;
    const resolved = region.getProps('sum');
    expect(resolved.loading).toBe(false);
    expect(resolved.sum).toBe(3);
  });
});

describe('async effect', () => {
  test('async effect', async () => {
    const delay = Promise.resolve();
    region.unstable_effect('result', 'asyncEffect', async ({ result }: any) => {
      await delay;
      return result + 1;
    });
    region.set('result', 1);
    const pending = region.getProps('asyncEffect');
    expect(pending.loading).toBe(true);
    expect(pending.asyncEffect).toBe(undefined);

    // go through next microtask
    await delay;
    await Promise.resolve();

    const resolved = region.getProps('asyncEffect');
    expect(resolved.loading).toBe(false);
    expect(resolved.asyncEffect).toBe(2);
  });
});
