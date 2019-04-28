import { region } from './region';

describe('effect', () => {
  test('1 + 1', () => {
    region.unstable_effect(['a', 'b'], 'sum', ({ a, b }: any) => a + b);

    region.set('a', 1);
    const { sum: middleStatus } = region.getProps('sum');
    expect(middleStatus).toBe(undefined); // b is loading

    region.set('b', 1);
    const { sum } = region.getProps('sum');
    expect(sum).toBe(2);
  });

  test('forward loading', async () => {
    const promise = region.load('a', Promise.resolve(2));
    const props = region.getProps('sum');
    expect(props.loading).toBe(true);
    expect(props.sum).toBe(2);
    await promise;
    const nextProps = region.getProps('sum');
    expect(nextProps.loading).toBe(false);
    expect(nextProps.sum).toBe(3);
  });
});
