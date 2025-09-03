import {describe, test, expect} from 'vitest';
import {renderHook} from '@testing-library/react-hooks';
import {createRegion} from '../index.js';

describe('localStorage hooks', () => {
    test('hook basic', async () => {
        const region = createRegion<Record<string, number>>({a: 1}, {withLocalStorageKey: 'key12'});
        const {result, waitForNextUpdate} = renderHook(() => region.useValue());
        expect(result.current).toEqual({a: 1});
        region.set({b: 2});
        await waitForNextUpdate();
        expect(result.current).toEqual({b: 2});
        const region2 = createRegion<Record<string, number>>({a: 1}, {withLocalStorageKey: 'key12'});
        const {result: result3} = renderHook(() => region2.useValue());
        expect(result3.current).toEqual({b: 2});
    });
});
