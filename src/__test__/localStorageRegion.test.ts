import {createRegion} from '..';
import {delayLoop} from '../util/delayLoop';

const toRaw = (key: string) => `${key}/value`;

const asyncFunc = async () => {
    await delayLoop();
    return 'a';
};

describe('localStorageRegion', () => {
    test('basic', async () => {
        const region = createRegion(false, {withLocalStorageKey: 'key'});
        expect(region.getValue()).toBe(false);
        region.set(true);
        expect(region.getValue()).toBe(true);
        expect(window.localStorage.getItem(toRaw('key'))).toBe('true');
        region.set(v => !v);
        expect(region.getValue()).toBe(false);
        expect(window.localStorage.getItem(toRaw('key'))).toBe('false');
    });

    test('set undefined to removeItem', () => {
        const region = createRegion<boolean | undefined>(undefined, {withLocalStorageKey: 'key2'});
        region.set(false);
        expect(region.getValue()).toBe(false);
        region.set(undefined);
        expect(window.localStorage.getItem(toRaw('key2'))).toBe(null);
        expect(region.getValue()).toBe(undefined);
    });

    test('use localStorage value', () => {
        window.localStorage.setItem(toRaw('key3'), '"bar"');
        const region = createRegion('foo', {withLocalStorageKey: 'key3'});
        expect(region.getValue()).toBe('bar');
    });

    test('unexpected value will fallback to initial value', () => {
        window.localStorage.setItem(toRaw('key4'), 'bar');
        const region = createRegion('foo', {withLocalStorageKey: 'key4'});
        expect(region.getValue()).toBe('foo');
    });

    test('load with localStorage', async () => {
        const region = createRegion<string>(undefined, {withLocalStorageKey: 'key5'});
        await region.load(asyncFunc());
        expect(region.getValue()).toBe('a');
        expect(window.localStorage.getItem(toRaw('key5'))).toBe('"a"');
    });

    test('getValue from localStorage will reset fallback value', () => {
        const region = createRegion(false, {withLocalStorageKey: 'key6'});
        expect(window.localStorage.getItem(toRaw('key6'))).toBe(null);
        expect(region.getValue()).toBe(false);
        expect(window.localStorage.getItem(toRaw('key6'))).toBe('false');
    });

    test('toggle localStorage value', () => {
        const region = createRegion(false, {withLocalStorageKey: 'key7'});
        expect(window.localStorage.getItem(toRaw('key7'))).toBe(null);
        region.set(v => !v);
        expect(window.localStorage.getItem(toRaw('key7'))).toBe('true');
    });

    test('toggle localStorage value with a prev get', () => {
        const region = createRegion(false, {withLocalStorageKey: 'key8'});
        expect(window.localStorage.getItem(toRaw('key8'))).toBe(null);
        expect(region.getValue()).toBe(false);
        region.set(v => !v);
        expect(region.getValue()).toBe(true);
        expect(window.localStorage.getItem(toRaw('key8'))).toBe('true');
    });
});
