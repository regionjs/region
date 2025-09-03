import {describe, test, expect} from 'vitest';
import {delayLoop} from '../utils/delayLoop.js';
import {createMappedRegion, createRegion} from '../index.js';

describe('reject race condition', () => {
    test('basic', async () => {
        const region = createRegion();
        const throwError = async () => {
            await delayLoop();
            throw 'error';
        };

        expect(region.getError()?.message).toBe(undefined);
        const promise = region.loadBy(throwError)();
        expect(region.getError()?.message).toBe(undefined);

        await promise;
        expect(region.getLoading()).toBe(false);
        expect(region.getError()?.message).toBe('error');
    });

    test('race error with acceptSequenced', async () => {
        const region = createRegion();
        const throwError = async () => {
            await delayLoop();
            throw 'error';
        };

        const resolve1 = async () => {
            await delayLoop(2);
            return 1;
        };

        const promise1 = region.loadBy(throwError)();
        const promise2 = region.loadBy(resolve1)();

        expect(region.getError()?.message).toBe(undefined);
        await promise1;
        expect(region.getLoading()).toBe(true);
        expect(region.getError()?.message).toBe('error');
        await promise2;
        expect(region.getLoading()).toBe(false);
        expect(region.getError()?.message).toBe(undefined);
    });

    test('race error with acceptLatest', async () => {
        const region = createRegion(undefined, {strategy: 'acceptLatest'});
        const throwError = async () => {
            await delayLoop();
            throw 'error';
        };

        const resolve1 = async () => {
            await delayLoop(2);
            return 1;
        };

        const promise1 = region.loadBy(throwError)();
        const promise2 = region.loadBy(resolve1)();

        expect(region.getError()?.message).toBe(undefined);
        await promise1;
        expect(region.getLoading()).toBe(true);
        expect(region.getError()?.message).toBe(undefined);
        await promise2;
        expect(region.getLoading()).toBe(false);
        expect(region.getError()?.message).toBe(undefined);
    });

    test('acceptEvery', async () => {
        const region = createRegion(undefined, {strategy: 'acceptEvery'});
        const throwError = () => new Promise((resolve, reject) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            setTimeout(() => reject('error'), 0);
        });

        const resolve1 = () => new Promise((resolve) => {
            setTimeout(() => resolve(1), 100);
        });

        region.loadBy(throwError)();
        region.loadBy(resolve1)();

        expect(region.getError()?.message).toBe(undefined);

        await delayLoop();
        expect(region.getLoading()).toBe(true);
        expect(region.getError()?.message).toBe('error');
    });
});

describe('bypass error when error should not be combined', () => {
    test('basic', async () => {
        const region = createRegion();
        const throwError = () => new Promise((resolve, reject) => {
            const error = new Error('error');
            // @ts-expect-error
            error.a = 1;
            setTimeout(() => reject(error), 0);
        });

        region.loadBy(throwError)();
        expect(region.getError()?.message).toBe(undefined);

        await delayLoop();
        expect(region.getError()?.message).toBe('error');
        // @ts-expect-error
        expect(region.getError()?.a).toBe(1);
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

describe('acceptFirst should clear promise with promise is rejected', () => {
    test('basic', async () => {
        const region = createRegion(undefined, {strategy: 'acceptFirst'});
        const asyncResolve = () => Promise.resolve('Angela Merkel');
        // eslint-disable-next-line prefer-promise-reject-errors
        const asyncReject = () => Promise.reject('error');

        expect.assertions(3);
        await region.loadBy(asyncReject)();
        expect(region.getValue()).toBe(undefined);
        expect(region.getError()).toStrictEqual(new Error('error'));

        await region.loadBy(asyncResolve)();
        expect(region.getValue()).toBe('Angela Merkel');
    });
});
