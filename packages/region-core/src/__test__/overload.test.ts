import {describe, test, expect} from 'vitest';
import {createMappedRegion} from '../index.js';

describe('overload', () => {
    test('overload', async () => {
        const mappedRegion = createMappedRegion<'a' | 'b', number | string>();
        const pureMappedRegion = createMappedRegion<'a' | 'b', number | string>(1);

        expect(mappedRegion.getValue('a')).toBe(undefined);
        expect(mappedRegion.getValue('b')).toBe(undefined);
        expect(pureMappedRegion.getValue('a')).toBe(1);
        expect(pureMappedRegion.getValue('b')).toBe(1);

        // eslint-disable-next-line prefer-promise-reject-errors
        const getAReject = (): Promise<number> => Promise.reject();
        const loadA = mappedRegion.loadBy('a', getAReject);
        const loadAPure = pureMappedRegion.loadBy('a', getAReject);

        expect.assertions(6); // sync 4 + async 2
        await Promise.all([loadA(), loadAPure()]);
        expect(mappedRegion.getValue('a')).toBe(undefined);
        expect(pureMappedRegion.getValue('a')).toBe(1);
    });
});
