import { createCombinedRegion } from '../..';

describe('overload', () => {
  test('overload', () => {
    interface Shape {
      a: number;
      b: string;
    }
    const combinedRegion = createCombinedRegion<Shape>();
    const pureCombinedRegion = createCombinedRegion<Shape>({ a: 1, b: 'x' });

    expect(combinedRegion.getValue('a')).toBe(undefined);
    expect(combinedRegion.getValue('b')).toBe(undefined);
    expect(pureCombinedRegion.getValue('a')).toBe(1);
    expect(pureCombinedRegion.getValue('b')).toBe('x');

    const getAReject = (): Promise<number> => Promise.reject();
    const loadA =  combinedRegion.loadBy('a', getAReject);
    const loadAPure = pureCombinedRegion.loadBy('a', getAReject);

    expect.assertions(6); // sync 4 + async 2
    return Promise.all([loadA(), loadAPure()]).then(([resultA, resultAPure]) => {
      expect(resultA).toBe(undefined);
      expect(resultAPure).toBe(1);
    });
  });
});
