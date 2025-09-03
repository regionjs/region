import {describe, test, expect} from 'vitest';
import {renderHook} from '@testing-library/react-hooks';
import {createRegion} from '../index.js';
import {delayLoop} from '../util/delayLoop.js';

const toRaw = (key: string) => `${key}/value`;

const asyncFunc = async () => {
    await delayLoop();
    return 'a';
};

describe('localStorageGetSet', () => {
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
        // 确保 getValue 不会改变 localStorage
        expect(window.localStorage.getItem(toRaw('key6'))).toBe(null);
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

    test('get value should be strict equal', () => {
        const region = createRegion(undefined, {withLocalStorageKey: 'key9'});
        region.set({a: 1});
        expect(window.localStorage.getItem(toRaw('key9'))).toBe('{"a":1}');
        const prevValue = region.getValue();
        expect(prevValue).toEqual({a: 1});
        expect(region.getValue() === prevValue).toBe(true);
    });

    test('return fallback value if localStorage can not be parsed', () => {
        const region = createRegion({a: 1}, {withLocalStorageKey: 'key10'});
        window.localStorage.setItem(toRaw('key10'), '{{bad json}');
        expect(region.getValue()).toEqual({a: 1});
    });

    test('load undefined value will reset localStorage', async () => {
        const region = createRegion(undefined, {withLocalStorageKey: 'key11'});
        window.localStorage.setItem(toRaw('key11'), 'false');
        expect(region.getValue()).toEqual(false);
        await region.load(Promise.resolve());
        expect(region.getValue()).toEqual(undefined);
    });

    test('hook basic', async () => {
        const region = createRegion<Record<string, number>>({a: 1}, {withLocalStorageKey: 'key12'});
        const {result, waitForNextUpdate} = renderHook(() => region.useValue());
        expect(result.current).toEqual({a: 1});
        region.set({b: 2});
        await waitForNextUpdate();
        expect(result.current).toEqual({b: 2});
        const region2 = createRegion<Record<string, number>>({a: 1}, {withLocalStorageKey: 'key12'});
        const {result: result3} = renderHook(() => region2.useValue());
        expect(result3.current).toEqual({b: 2});
    });
});
