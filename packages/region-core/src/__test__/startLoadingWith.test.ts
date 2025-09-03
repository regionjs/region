import {describe, test, expect} from 'vitest';
import {createRegion} from '..';
import {delayLoop} from '../util/delayLoop';

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
