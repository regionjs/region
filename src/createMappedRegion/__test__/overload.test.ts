import { createMappedRegion } from '../..';

describe('overload', () => {
  test('overload', () => {
    const combinedRegion = createMappedRegion<'a'| 'b', number | string>();
    const pureCombinedRegion = createMappedRegion<'a'| 'b', number | string>(1);

    expect(combinedRegion.getValue('a')).toBe(undefined);
    expect(combinedRegion.getValue('b')).toBe(undefined);
    expect(pureCombinedRegion.getValue('a')).toBe(1);
    expect(pureCombinedRegion.getValue('b')).toBe(1);

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
