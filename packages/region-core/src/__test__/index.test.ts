import {describe, test, expect} from 'vitest';
import * as api from '../index.js';

describe('export api', () => {
    test('api contains', () => {
        const {
            // @ts-expect-error
            __esModule,
            createRegion,
            createMappedRegion,
            ...rest
        } = api;
        expect(__esModule || __esModule === undefined).toBe(true);
        expect(typeof createRegion).toBe('function');
        expect(typeof createMappedRegion).toBe('function');
        expect(rest).toEqual({});
    });

    test('createRegion contains many api', () => {
        const {createRegion} = api;
        const {
            set, setValue, reset, load, loadBy, emit, subscribe,
            get, getValue, getLoading, getError, getPromise,
            ...rest
        } = createRegion();
        expect(typeof set).toBe('function');
        expect(typeof setValue).toBe('function');
        expect(typeof reset).toBe('function');
        expect(typeof load).toBe('function');
        expect(typeof loadBy).toBe('function');
        expect(typeof get).toBe('function');
        expect(typeof getValue).toBe('function');
        expect(typeof getLoading).toBe('function');
        expect(typeof getError).toBe('function');
        expect(typeof getPromise).toBe('function');
        expect(rest).toEqual({});
    });

    test('createMappedRegion contains many api', () => {
        const {createMappedRegion} = api;
        const {
            set, setValue, reset, resetAll, load, loadBy, emit, subscribe,
            get, getValue, getLoading, getError, getPromise,
            _internal,
            ...rest
        } = createMappedRegion();
        expect(typeof set).toBe('function');
        expect(typeof setValue).toBe('function');
        expect(typeof reset).toBe('function');
        expect(typeof load).toBe('function');
        expect(typeof loadBy).toBe('function');
        expect(typeof get).toBe('function');
        expect(typeof getValue).toBe('function');
        expect(typeof getLoading).toBe('function');
        expect(typeof getError).toBe('function');
        expect(typeof getPromise).toBe('function');
        expect(typeof _internal).toBe('object');
        expect(rest).toEqual({});
    });
});
