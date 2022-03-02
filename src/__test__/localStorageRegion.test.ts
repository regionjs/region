import {createLocalStorageRegion} from '..';

describe('localStorageRegion', () => {
    test('basic', async () => {
        const region = createLocalStorageRegion('key', false);
        expect(region.getValue()).toBe(false);
        region.set(true);
        expect(region.getValue()).toBe(true);
        expect(window.localStorage.getItem('key')).toBe('true');
        region.set(v => !v);
        expect(region.getValue()).toBe(false);
        expect(window.localStorage.getItem('key')).toBe('false');
    });

    test('set undefined to removeItem', () => {
        const region = createLocalStorageRegion<boolean | undefined>('key2', undefined);
        region.set(false);
        expect(region.getValue()).toBe(false);
        region.set(undefined);
        expect(window.localStorage.getItem('key2')).toBe(null);
        expect(region.getValue()).toBe(undefined);
    });

    test('use localStorage value', () => {
        window.localStorage.setItem('key3', '"bar"');
        const region = createLocalStorageRegion('key3', 'foo');
        expect(region.getValue()).toBe('bar');
    });

    test('unexpected value will fallback to initial value', () => {
        window.localStorage.setItem('key4', 'bar');
        const region = createLocalStorageRegion('key4', 'foo');
        expect(region.getValue()).toBe('foo');
    });
});
