import {delay} from '../../util/delay';
import {createMappedRegion} from '../..';

describe('createStore', () => {
    test('set string', () => {
        const region = createMappedRegion<string, string>();
        const result = 'a user';
        region.set('user', result);
        expect(region.private_getState_just_for_test()).toEqual({
            user: {
                error: undefined,
                pendingMutex: 0,
                value: 'a user',
            },
        });
    });

    test('set array', () => {
        const region = createMappedRegion<string, Array<{id: number, name: string}>>();
        const result = [{id: 1, name: 'zhangcong'}, {id: 2, name: 'milly'}];
        region.set('user', result);
        expect(region.private_getState_just_for_test()).toEqual({
            user: {
                error: undefined,
                pendingMutex: 0,
                value: [{id: 1, name: 'zhangcong'}, {id: 2, name: 'milly'}],
            },
        });
    });

    test('function', () => {
        const region = createMappedRegion<string, () => string>();
        const result = () => 'should be string';
        region.set('user', result);
        expect(region.private_getState_just_for_test()).toEqual({
            user: {
                error: undefined,
                pendingMutex: 0,
                value: 'should be string',
            },
        });
    });

    test('error', async () => {
        const region = createMappedRegion<string, string>();
        const error = new Error('error');
        const promise = Promise.reject(error);
        region.loadBy('user', () => promise)();
        await delay(50);
        expect(region.private_getState_just_for_test()).toEqual({
            user: {
                error,
                pendingMutex: 0,
                value: undefined,
                promise,
            },
        });
    });

    test('error not cover snapshot', async () => {
        const region = createMappedRegion<string, string>();
        const result = 'a user';
        const error = new Error('error');
        const promise = Promise.reject(error);
        region.set('user', result);
        // actually region-core will do
        region.loadBy('user', () => promise)();
        await delay(50);
        expect(region.private_getState_just_for_test()).toEqual({
            user: {
                error,
                pendingMutex: 0,
                value: 'a user',
                promise,
            },
        });
    });
});
