import * as api from '..';

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
            set, reset, load, loadBy,
            getValue, getLoading, getError, getPromise,
            useValue, useLoading, useError, useData,
            ...rest
        } = createRegion();
        expect(typeof set).toBe('function');
        expect(typeof reset).toBe('function');
        expect(typeof load).toBe('function');
        expect(typeof loadBy).toBe('function');
        expect(typeof getValue).toBe('function');
        expect(typeof getLoading).toBe('function');
        expect(typeof getError).toBe('function');
        expect(typeof getPromise).toBe('function');
        expect(typeof useValue).toBe('function');
        expect(typeof useLoading).toBe('function');
        expect(typeof useError).toBe('function');
        expect(typeof useData).toBe('function');
        expect(rest).toEqual({});
    });

    test('createMappedRegion contains many api', () => {
        const {createMappedRegion} = api;
        const {
            set, reset, resetAll, load, loadBy,
            getValue, getLoading, getError, getPromise,
            useValue, useLoading, useError, useData,
            ...rest
        } = createMappedRegion();
        expect(typeof set).toBe('function');
        expect(typeof reset).toBe('function');
        expect(typeof load).toBe('function');
        expect(typeof loadBy).toBe('function');
        expect(typeof getValue).toBe('function');
        expect(typeof getLoading).toBe('function');
        expect(typeof getError).toBe('function');
        expect(typeof getPromise).toBe('function');
        expect(typeof useValue).toBe('function');
        expect(typeof useLoading).toBe('function');
        expect(typeof useError).toBe('function');
        expect(typeof useData).toBe('function');
        expect(rest).toEqual({});
    });
});
