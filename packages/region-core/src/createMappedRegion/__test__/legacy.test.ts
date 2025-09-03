import {describe, test, expect} from 'vitest';
import {delayLoop} from '../../util/delayLoop.js';
import {createMappedRegion} from '../../index.js';

describe('createStore', () => {
    test('set string', () => {
        const region = createMappedRegion<string, string>();
        const result = 'a user';
        region.set('user', result);
        expect(region.getValue('user')).toEqual('a user');
    });

    test('set array', () => {
        const region = createMappedRegion<string, {id: number; name: string}[]>();
        const result = [{id: 1, name: 'zhangcong'}, {id: 2, name: 'milly'}];
        region.set('user', result);
        expect(region.getValue('user')).toEqual([{id: 1, name: 'zhangcong'}, {id: 2, name: 'milly'}]);
    });

    test('function', () => {
        const region = createMappedRegion<string, () => string>();
        const result = () => 'should be string';
        region.set('user', result);
        expect(region.getValue('user')).toEqual('should be string');
    });

    test('error', async () => {
        const region = createMappedRegion<string, string>();
        const error = new Error('error');
        const promise = Promise.reject(error);
        region.loadBy('user', () => promise)();
        await delayLoop();
        expect(region.getValue('user')).toEqual(undefined);
        expect(region.getError('user')).toEqual(error);
    });

    test('error not cover snapshot', async () => {
        const region = createMappedRegion<string, string>();
        const result = 'a user';
        const error = new Error('error');
        const promise = Promise.reject(error);
        region.set('user', result);
        // actually region-core will do
        region.loadBy('user', () => promise)();
        await delayLoop();
        expect(region.getValue('user')).toEqual('a user');
        expect(region.getError('user')).toEqual(error);
    });
});

describe('get', () => {
    test('get things from nothing', () => {
        const region = createMappedRegion<string, string>();
        expect(region.getLoading('a')).toEqual(true);
        expect(region.getValue('a')).toEqual(undefined);
        expect(region.getError('a')).toEqual(undefined);
    });
});
