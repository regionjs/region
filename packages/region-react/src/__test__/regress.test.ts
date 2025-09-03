import {describe, expect, test} from 'vitest';
import {renderHook} from '@testing-library/react-hooks';
import {createRegion} from '../index.js';

describe('falsy useValue will not return undefined', () => {
    test('basic', () => {
        const region = createRegion();
        region.set(false);
        const {result} = renderHook(() => region.useValue());
        expect(result.current).toBe(false);
        // @ts-expect-error
        const {result: result2} = renderHook(() => region.useValue(aBoolean => aBoolean.value.value));
        expect(result2.current).toBe(false);
    });
});
