import {renderHook} from '@testing-library/react-hooks';
import {createMappedRegion, createRegion} from '..';

describe('reject race condition', () => {
    test('basic', done => {
        const region = createRegion();
        const throwError = () => new Promise((resolve, reject) => {
            setTimeout(() => reject('error'), 0);
        });

        region.loadBy(throwError)();

        expect(region.getError()?.message).toBe(undefined);
        setTimeout(
            () => {
                expect(region.getLoading()).toBe(false);
                expect(region.getError()?.message).toBe('error');
                done();
            },
            50
        );
    });

    test('race', done => {
        const region = createRegion();
        const throwError = () => new Promise((resolve, reject) => {
            setTimeout(() => reject('error'), 0);
        });

        const resolve1 = () => new Promise(resolve => {
            setTimeout(() => resolve(1), 100);
        });

        region.loadBy(throwError)();
        region.loadBy(resolve1)();

        expect(region.getError()?.message).toBe(undefined);
        setTimeout(
            () => {
                expect(region.getLoading()).toBe(true);
                expect(region.getError()?.message).toBe(undefined);
                done();
            },
            50
        );
    });

    test('acceptEvery', done => {
        const region = createRegion(undefined, {strategy: 'acceptEvery'});
        const throwError = () => new Promise((resolve, reject) => {
            setTimeout(() => reject('error'), 0);
        });

        const resolve1 = () => new Promise(resolve => {
            setTimeout(() => resolve(1), 100);
        });

        region.loadBy(throwError)();
        region.loadBy(resolve1)();

        expect(region.getError()?.message).toBe(undefined);
        setTimeout(
            () => {
                expect(region.getLoading()).toBe(true);
                expect(region.getError()?.message).toBe('error');
                done();
            },
            50
        );
    });
});

describe('bypass error when error should not be combined', () => {
    test('basic', done => {
        const region = createRegion();
        const throwError = () => new Promise((resolve, reject) => {
            const error = new Error('error');
            // @ts-expect-error
            error.a = 1;
            setTimeout(() => reject(error), 0);
        });

        region.loadBy(throwError)();
        expect(region.getError()?.message).toBe(undefined);

        setTimeout(
            () => {
                expect(region.getError()?.message).toBe('error');
                // @ts-expect-error
                expect(region.getError()?.a).toBe(1);
                done();
            },
            50
        );
    });
});

describe('loadBy sync function with reducer will not omit', () => {
    test('basic', async () => {
        const region = createRegion();
        const syncFunction = () => 1;
        expect(region.getValue()).toBe(undefined);
        // @ts-expect-error
        await region.loadBy(syncFunction, (_, result) => result)();
        expect(region.getValue()).toBe(1);
    });
});

describe('reset region first', () => {
    test('basic', () => {
        const region = createRegion();
        expect(() => region.reset()).not.toThrow();

        const mappedRegion = createMappedRegion();
        expect(() => mappedRegion.resetAll()).not.toThrow();
    });
});

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
