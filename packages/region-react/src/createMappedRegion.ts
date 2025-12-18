/* eslint-disable max-lines */
import {useMemo, useRef, useSyncExternalStore} from 'react';
import {createMappedRegion as createCoreMappedRegion} from 'region-core';
import type {
    MappedRegionUninitialized as CoreMappedRegionUninitialized,
    MappedRegionInitialized as CoreMappedRegionInitialized,
} from 'region-core';
import {getLocalStorageState, parseLocalStorageState} from 'region-core/es/utils/localStorageUtils.js';
import {useStorageEvent} from './utils/document.js';
import {RegionOption, Listener} from 'region-core/es/types.js';
import {g} from 'vitest/dist/chunks/suite.d.FvehnV49.js';

export interface MappedRegionUninitialized<K, V> extends Omit<CoreMappedRegionUninitialized<K, V>, '_internal'> {
    use: {
        (key: K): V | undefined;
        <TResult>(key: K, selector: (value: V | undefined) => TResult): TResult;
    };
    useValue: {
        (key: K): V | undefined;
        <TResult>(key: K, selector: (value: V | undefined) => TResult): TResult;
    };
    useLoading: (key: K) => boolean;
    useError: (key: K) => Error | undefined;
}

export interface MappedRegionInitialized<K, V> extends Omit<CoreMappedRegionInitialized<K, V>, '_internal'> {
    use: {
        (key: K): V;
        <TResult>(key: K, selector: (value: V) => TResult): TResult;
    };
    useValue: {
        (key: K): V;
        <TResult>(key: K, selector: (value: V) => TResult): TResult;
    };
    useLoading: (key: K) => boolean;
    useError: (key: K) => Error | undefined;
}

// overload is unsafe in some way, ensure the return type is correct
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function createMappedRegion<K, V>(initialValue: void | undefined, option?: RegionOption): MappedRegionUninitialized<K, V>;
export function createMappedRegion<K, V>(initialValue: V, option?: RegionOption): MappedRegionInitialized<K, V>;
export function createMappedRegion<K, V>(initialValue: V | void | undefined, option?: RegionOption): MappedRegionUninitialized<K, V> | MappedRegionInitialized<K, V> {
    type Result = MappedRegionInitialized<K, V>;

    const withLocalStorageKey: string | undefined = option?.withLocalStorageKey;
    const syncLocalStorageFromEvent = option?.syncLocalStorageFromEvent ?? true;

    const mappedRegion = createCoreMappedRegion(initialValue, option) as CoreMappedRegionInitialized<K, V>;

    const private_store_get = mappedRegion._internal.private_store_get;

    const private_store_set = mappedRegion._internal.private_store_set;

    const private_getKeyString = mappedRegion._internal.private_getKeyString;
    /* -------- */

    // ---- APIs ----
    const setValue: Result['setValue'] = mappedRegion.set as Result['setValue'];

    const reset: Result['reset'] = mappedRegion.reset;

    const resetAll: Result['resetAll'] = mappedRegion.resetAll;

    const emit: Result['emit'] = mappedRegion.emit;

    const subscribe: Result['subscribe'] = mappedRegion.subscribe;

    const loadBy: Result['loadBy'] = mappedRegion.loadBy;

    const load: Result['load'] = mappedRegion.load;

    const getValue: Result['getValue'] = mappedRegion.getValue as Result['getValue'];

    const getLoading: Result['getLoading'] = mappedRegion.getLoading;

    const getError: Result['getError'] = mappedRegion.getError;

    const getPromise: Result['getPromise'] = mappedRegion.getPromise as Result['getPromise'];

    const createHooks = <TReturnType>(getFn: (key: K) => TReturnType) => {
        return (key: K): TReturnType => {
            const keyString = private_getKeyString(key);
            const subscription = useMemo(
                () => ({
                    getCurrentValue: () => getFn(key),
                    subscribe: (listener: Listener) => subscribe(key, listener),
                    getServerSnapshot: () => initialValue as TReturnType,
                }),
                // shallow-equal
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [keyString],
            );
            return useSyncExternalStore(
                subscription.subscribe,
                subscription.getCurrentValue,
                subscription.getServerSnapshot,
            );
        };
    };

    const useValue: Result['useValue'] = <TResult>(key: K, selector?: (value: V) => TResult) => {
        const keyString = private_getKeyString(key);
        const subscription = useMemo(
            () => ({
                getCurrentValue: () => {
                    const value = getValue(key);
                    if (!selector) {
                        return value;
                    }
                    try {
                        return selector(value);
                    }
                    catch (e) {
                        console.error(e);
                        console.error('Above error occurs in selector.');
                        return value;
                    }
                },
                subscribe: (listener: Listener) => subscribe(key, listener),
                getServerSnapshot: () => {
                    if (!selector) {
                        return initialValue;
                    }
                    try {
                        return selector(initialValue as V);
                    }
                    catch (e) {
                        console.error(e);
                        console.error('Above error occurs in selector.');
                        return initialValue;
                    }
                },
            }),
            // shallow-equal
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [selector, keyString],
        );

        // @ts-ignore
        const timerRef = useRef<any>();

        // unable to fire storage event yet, see https://github.com/testing-library/dom-testing-library/issues/438
        // istanbul ignore next
        useStorageEvent((e) => {
            clearTimeout(timerRef.current);
            if (!withLocalStorageKey || !syncLocalStorageFromEvent) {
                return;
            }
            if (e.storageArea !== localStorage) {
                return;
            }
            const storageKey = `${withLocalStorageKey}/${keyString}`;
            if (e.key !== storageKey) {
                return;
            }
            const jsonString = getLocalStorageState(`${withLocalStorageKey}/${key}`);
            const snapshot = private_store_get(keyString);
            const jsonStringSnapshot: string | undefined = JSON.stringify(snapshot);
            if (jsonStringSnapshot === jsonString) {
                return;
            }
            // setTimeout to avoid potential infinite loop
            timerRef.current = setTimeout(
                () => {
                    const localStorageValue = parseLocalStorageState<V>(jsonString, initialValue as V);
                    private_store_set(keyString, localStorageValue, {fromLocalStorage: true});
                },
                300,
            );
        });
        return useSyncExternalStore(
            subscription.subscribe,
            subscription.getCurrentValue,
            subscription.getServerSnapshot,
        );
    };

    const useLoading: Result['useLoading'] = createHooks(getLoading);

    const useError: Result['useError'] = createHooks(getError);

    return {
        set: setValue,
        setValue,
        reset,
        resetAll,
        emit,
        // emitAll,
        subscribe,
        load,
        loadBy,
        get: getValue,
        getValue,
        getLoading,
        getError,
        getPromise,
        use: useValue,
        useValue,
        useLoading,
        useError,
    };
}
