import {region} from './region';

const {set, reset, resetAll, loadBy, getValue} = region;

describe('set', () => {
    test('string', () => {
        const result = set('user', 'a user');
        expect(result).toBe('a user');
    });

    test('array', () => {
        const target = [{id: 1, name: 'zhangcong'}, {id: 2, name: 'milly'}];
        const result = set('user', target);
        expect(result).toBe(target);
    });

    test('function', () => {
        const target = () => 'should be string';
        const result = set('user', target);
        expect(result).toBe('should be string');
    });

    test('reset', () => {
        const result = reset('user');
        expect(result).toBe(undefined);
    });

    test('resetAll', () => {
        set('user1', 'a user');
        set('user2', 'another user');

        expect(getValue('user1')).toBe('a user');
        expect(getValue('user2')).toBe('another user');

        reset('user1');

        expect(getValue('user1')).toBe(undefined);
        expect(getValue('user2')).toBe('another user');

        resetAll();

        expect(getValue('user1')).toBe(undefined);
        expect(getValue('user2')).toBe(undefined);
    });
});

describe('load', () => {
    test('fallback to set', async () => {
    // @ts-ignore
        const result = await loadBy('user', 'set a user')();
        expect(result).toBe('set a user');
    });

    test('promise', async () => {
    // @ts-ignore
        const result = await loadBy('user', Promise.resolve('a user'))();
        expect(result).toBe('a user');
    });

    test('asyncFunction', async () => {
        const result = await loadBy('user', () => Promise.resolve('another user'))();
        expect(result).toBe('another user');
    });

    test('format', async () => {
        const result = await loadBy('user', () => Promise.resolve('0'), (_: string, user: string) => `${user}1`)();
        expect(result).toBe('01');
    });

    test('format snapshot', async () => {
        const result = await loadBy(
            'user',
            () => Promise.resolve('2'),
            (snapshot: any, user: any) => `${snapshot}${user}3`
        )();
        expect(result).toBe('0123');
    });

    test('reject', async () => {
        const result = await loadBy('user', () => Promise.reject(new Error('2')))();
        expect(result).toBe('0123');
    });

    test('params can be array', async () => {
        const result = await loadBy('array', (array: any) => Promise.resolve(array.length))([0, 1]);
        expect(result).toBe(2);
    });
});

describe('getReducedValue', () => {
    test('getProps', () => {
        const reducer = (state: any, params: string) => {
            const {value, pendingMutex} = state[params] ?? {};
            return {loading: pendingMutex !== 0, value};
        };
        expect(region.getReducedValue('uniq1', reducer)).toEqual({value: undefined, loading: true});

        region.set('uniq1', 1);
        expect(region.getReducedValue('uniq1', reducer)).toEqual({value: 1, loading: false});
    });

    test('getListValue', () => {
        const reducer = (state: any, params: string[]) => {
            return params.map(key => (state[key] ?? {}).value);
        };
        expect(region.getReducedValue(['a', 'b'], reducer)).toEqual([undefined, undefined]);

        region.set('a', 1);
        region.set('b', 2);
        region.set('c', 3);

        expect(region.getReducedValue(['a', 'b'], reducer)).toEqual([1, 2]);
    });
});
