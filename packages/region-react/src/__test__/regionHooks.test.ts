import {describe, test, expect} from 'vitest';
import {renderHook} from '@testing-library/react-hooks';
import {createRegion} from '../index.js';

describe('useLoading', () => {
    test('useLoading', async () => {
        const region = createRegion();
        const {result, waitForNextUpdate} = renderHook(() => region.useLoading());
        expect(result.current).toBe(true);
        region.set('Sharon Brown');
        await waitForNextUpdate();
        expect(result.current).toBe(false);
    });

    test('hook unmount and mount', async () => {
        const region = createRegion();
        const {result: result1, unmount} = renderHook(() => region.useLoading());
        const {result: result2, waitForNextUpdate} = renderHook(() => region.useLoading());
        expect(result1.current).toBe(true);
        expect(result2.current).toBe(true);
        await unmount();
        expect(result1.current).toBe(true);
        expect(result2.current).toBe(true);
        region.set('Sharon Brown');
        await waitForNextUpdate();
        expect(result1.current).toBe(true);
        expect(result2.current).toBe(false);
    });
});

describe('useValue', () => {
    test('useValue', async () => {
        const region = createRegion();
        const {result, waitForNextUpdate} = renderHook(() => region.useValue());
        expect(result.current).toBe(undefined);
        region.set('Elizabeth Taylor');
        await waitForNextUpdate();
        expect(result.current).toBe('Elizabeth Taylor');
    });

    test('useValue with reset', async () => {
        const region = createRegion('Fred Smith');
        const {result, waitForNextUpdate} = renderHook(() => region.useValue());
        expect(result.current).toBe('Fred Smith');
        region.set('George Washington');
        await waitForNextUpdate();
        expect(result.current).toBe('George Washington');
        region.reset();
        await waitForNextUpdate();
        expect(result.current).toBe('Fred Smith');
    });

    test('useValue with load', async () => {
        const region = createRegion();
        const {result, waitForNextUpdate} = renderHook(() => region.useValue());
        expect(result.current).toBe(undefined);
        await region.load(Promise.resolve('Henry Ford'));
        await waitForNextUpdate();
        expect(result.current).toBe('Henry Ford');
    });

    test('useValue with selector', async () => {
        const region = createRegion<string>();
        const {result, rerender} = renderHook(() => region.useValue(s => s?.charAt(0)));
        expect(result.current).toBe(undefined);
        await region.load(Promise.resolve('Henry Ford'));
        await rerender();
        expect(result.current).toBe('H');
    });

    test('useValue with localStorage', async () => {
        const region = createRegion<string[]>([], {withLocalStorageKey: 'region/useValue'});
        window.localStorage.setItem('region/useValue/value', '["a"]');
        const {result} = renderHook(() => region.useValue());
        expect(result.current).toEqual(['a']);
    });
});

describe('useError', () => {
    test('useError', async () => {
        const region = createRegion();
        const {result, waitForNextUpdate} = renderHook(() => region.useError());
        expect(result.current).toBe(undefined);
        region.set('Irene Kennedy');
        expect(result.current).toBe(undefined);
        const error = new Error('Oops');
        await region.load(Promise.reject(error));
        await waitForNextUpdate();
        expect(result.current instanceof Error).toBe(true);
        expect(result.current).toBe(error);
        region.reset();
        await waitForNextUpdate();
        expect(result.current).toBe(undefined);
    });

    test('useError with string reject', async () => {
        const region = createRegion();
        const {result, waitForNextUpdate} = renderHook(() => region.useError());
        expect(result.current).toBe(undefined);
        region.set('Irene Kennedy');
        expect(result.current).toBe(undefined);
        const error = 'just string';
        await region.load(Promise.reject(error));
        await waitForNextUpdate();
        expect(result.current instanceof Error).toBe(true);
        expect(result.current).not.toBe('just string');
        expect(result.current?.message).toBe('just string');
    });
});
