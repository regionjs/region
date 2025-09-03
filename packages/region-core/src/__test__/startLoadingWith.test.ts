import {describe, test, expect} from 'vitest';
import {createRegion} from '../index.js';
import {delayLoop} from '../util/delayLoop.js';

describe('startLoadingWith', () => {
    test('default', async () => {
        const region = createRegion();
        expect(region.getLoading()).toBe(true);
        const promise = region.load(delayLoop());
        expect(region.getLoading()).toBe(true);
        await promise;
        expect(region.getLoading()).toBe(false);
    });

    test('starLoadingWith false', async () => {
        const region = createRegion(undefined, {startLoadingWith: false});
        expect(region.getLoading()).toBe(false);
        const promise = region.load(delayLoop());
        expect(region.getLoading()).toBe(true);
        await promise;
        expect(region.getLoading()).toBe(false);
    });
});
