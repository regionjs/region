import { region } from './region';

describe('effect', () => {
  test('1 + 1', () => {
    region.unstable_effect(['a', 'b'], 'sum', ({ a, b }: any) => a + b);

    region.set('a', 1);
    const { sum: middleStatus } = region.getProps('sum');
    expect(middleStatus).toBe(NaN);

    region.set('b', 1);
    const { sum } = region.getProps('sum');
    expect(sum).toBe(2);
  });
});
