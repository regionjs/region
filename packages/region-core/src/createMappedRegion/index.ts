/* eslint-disable max-lines */
import {useMemo, useRef, useSyncExternalStore} from 'react';
import jsonStableStringify from 'json-stable-stringify';
import {deprecate} from '../util/deprecate.js';
import {uniqLast, isLatest} from '../util/promiseQueue.js';
import {getLocalStorageState, parseLocalStorageState, setLocalStorageState} from '../util/localStorageUtils.js';
import {useStorageEvent} from '../util/document.js';
import {ResultFunc, ResultFuncPure, Strategy, RegionOption, Listener} from '../types/index.js';

type IncreaseDecrease = (v: number | undefined) => number;
const increase: IncreaseDecrease = (v = 0) => (v + 1);
const decrease: IncreaseDecrease = (v = 0) => (v - 1 > 0 ? v - 1 : 0);

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
    if (typeof resultOrFunc === 'function') {
        return (resultOrFunc as ResultFuncPure<V>)(snapshot);
    }
    return resultOrFunc;
};

const silent = async (promise: Promise<unknown>) => {
    try {
        await promise;
    }
    catch {
        // do nothing
    }
};

const private_toPromise = async <V, TParams, TResult>(
    asyncFunction: (params: TParams) => Promise<TResult>,
    reducer?: (state: V, result: TResult, params: TParams) => V,
    params?: TParams,
    // @ts-expect-error
    getReducerState: () => V,
): Promise<V> => {
    // maybe promise, asyncFunction may return native value
    const promise = typeof asyncFunction === 'function' ? asyncFunction(params as TParams) : asyncFunction;
    if (typeof reducer === 'function') {
        const result = await promise;
        return reducer(getReducerState(), result, params as TParams);
    }
    return promise as unknown as Promise<V>;
};

const toError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === 'string') {
        return new Error(error);
    }
    return new Error(`You should throw an Error or a string to reject Promise, received ${error}`);
};

interface LoadBy<K, V, Extend> {
    (
        key: K | (() => K),
        asyncFunction: () => Promise<V>,
    ): () => Promise<void>;
    <TResult = unknown>(
        key: K | (() => K),
        asyncFunction: () => Promise<TResult>,
        reducer: (state: V | Extend, result: TResult) => V,
    ): () => Promise<void>;
    <TParams = void>(
        key: K | ((params: TParams) => K),
        asyncFunction: (params: TParams) => Promise<V>,
    ): (params: TParams) => Promise<void>;
    <TParams = void, TResult = unknown>(
        key: K | ((params: TParams) => K),
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer: (state: V | Extend, result: TResult, params: TParams) => V,
    ): (params: TParams) => Promise<void>;
}

export interface CreateMappedRegionReturnValue<K, V> {
    set: (key: K, resultOrFunc: V | ResultFunc<V>) => void;
    reset: (key: K) => void;
    resetAll: () => void;
    // emit: (key: K) => void;
    // emitAll: () => void;
    load: (key: K, promise: Promise<V>) => Promise<void>;
    loadBy: LoadBy<K, V, undefined>;
    getValue: (key: K) => V | undefined;
    getLoading: (key: K) => boolean;
    getError: (key: K) => Error | undefined;
    getPromise: (key: K) => Promise<V> | undefined;
    useValue: {
        (key: K): V | undefined;
        <TResult>(key: K, selector: (value: V | undefined) => TResult): TResult;
    };
    useLoading: (key: K) => boolean;
    useError: (key: K) => Error | undefined;
}

export interface CreateMappedRegionPureReturnValue<K, V> extends Omit<CreateMappedRegionReturnValue<K, V>, 'set' | 'loadBy' | 'getValue' | 'useValue'> {
    set: (key: K, resultOrFunc: V | ResultFuncPure<V>) => void;
    loadBy: LoadBy<K, V, never>;
    getValue: (key: K) => V;
    useValue: {
        (key: K): V;
        <TResult>(key: K, selector: (value: V) => TResult): TResult;
    };
}

// overload is unsafe in some way, ensure the return type is correct
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
function createMappedRegion<K, V>(initialValue: void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion<K, V>(initialValue: V, option?: RegionOption): CreateMappedRegionPureReturnValue<K, V>;
function createMappedRegion<K, V>(initialValue: V | void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
    type Result = CreateMappedRegionPureReturnValue<K, V>;

    const strategy: Strategy = option?.strategy ?? 'acceptSequenced';

    const withLocalStorageKey: string | undefined = option?.withLocalStorageKey;
    const syncLocalStorageFromEvent = option?.syncLocalStorageFromEvent ?? true;

    interface PrivateStoreStateRef {
        pendingMutex: Map<string, number>;
        value: Map<string, V>;
        promiseQueue: Map<string, Promise<V>[]>;
        error: Map<string, Error>;
        listeners: Map<string, Set<Listener>>;
    }

    const ref: PrivateStoreStateRef = {
        pendingMutex: new Map<string, number>(),
        value: new Map<string, V>(),
        promiseQueue: new Map<string, Promise<V>[]>(),
        error: new Map<string, Error>(),
        listeners: new Map<string, Set<Listener>>(),
    };

    const private_store_emit = (key: string): void => {
        const listeners = ref.listeners.get(key);
        if (!listeners) {
            return;
        }
        listeners.forEach(listener => listener());
    };

    interface PrivateOptionsLoadStart {
        promise: Promise<V>;
    }

    const private_store_loadStart = (key: string, {promise}: PrivateOptionsLoadStart): void => {
        const promiseQueue = ref.promiseQueue.get(key) ?? [];
        const nextPromiseQueue = uniqLast(promiseQueue, promise);
        ref.promiseQueue.set(key, nextPromiseQueue);
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, increase(prevPendingMutex));
        private_store_emit(key);
    };

    type PrivateOptionsLoadEnd = {
        skip: true;
        promise: Promise<V>;
    } | {
        skip: false;
        promise: Promise<V>;
        value: V;
    };

    const private_store_loadEnd = (key: string, options: PrivateOptionsLoadEnd): void => {
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, decrease(prevPendingMutex));
        if (!options.skip) {
            ref.value.set(key, options.value);
            if (withLocalStorageKey) {
                const jsonString: string | undefined = JSON.stringify(options.value);
                setLocalStorageState(`${withLocalStorageKey}/${key}`, jsonString);
            }
            ref.error.delete(key); // reset error
        }
        private_store_emit(key);
    };

    interface PrivateOptionsSet {
        fromLocalStorage?: boolean;
    }

    const private_store_set = (key: string, value: V, options?: PrivateOptionsSet): void => {
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, decrease(prevPendingMutex));
        ref.value.set(key, value);
        if (withLocalStorageKey && !options?.fromLocalStorage) {
            const jsonString: string | undefined = JSON.stringify(value);
            setLocalStorageState(`${withLocalStorageKey}/${key}`, jsonString);
        }
        ref.error.delete(key); // reset error

        private_store_emit(key);
    };

    const private_store_setError = (key: string, error: Error): void => {
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, decrease(prevPendingMutex));
        ref.error.set(key, error);
        console.error(error);
        private_store_emit(key);
    };

    const private_store_reset = (key: string): void => {
        ref.pendingMutex.delete(key);
        ref.value.delete(key);
        ref.promiseQueue.delete(key);
        ref.error.delete(key);
        private_store_emit(key);
    };

    const private_store_resetAll = (): void => {
        // pendingMutex covers load/loadEnd/set/setError
        const keys = Array.from(ref.pendingMutex.keys());
        ref.pendingMutex.clear();
        ref.value.clear();
        ref.promiseQueue.clear();
        ref.error.clear();
        keys.forEach((key: string) => {
            private_store_emit(key);
        });
    };

    const private_store_subscribe = (key: string, listener: Listener): () => void => {
        if (!ref.listeners.get(key)) {
            ref.listeners.set(key, new Set());
        }

        // istanbul ignore next - should always be true
        if (typeof listener === 'function') {
            const listeners = ref.listeners.get(key);
            // since it is ensured
            listeners?.add(listener);
        }
        else {
            // istanbul ignore next
            console.warn(`listener should be function, but received ${listener}`);
        }

        return () => {
            const listeners = ref.listeners.get(key);
            listeners?.delete(listener);
        };
    };

    const private_getValueOrInitialValue = (key: string): V => {
        if (withLocalStorageKey) {
            const jsonString = getLocalStorageState(`${withLocalStorageKey}/${key}`);
            const localStorageValue = parseLocalStorageState<V>(jsonString, initialValue as V);
            // 这里不 emit，所以直接操作 ref
            ref.value.set(key, localStorageValue);
            return localStorageValue;
        }
        return initialValue as V;
    };

    const private_getKeyString = (key: K): string => {
        if (typeof key === 'string') {
            return key;
        }
        if (key === undefined) {
            return key as string;
        }
        return jsonStableStringify(key) as string;
    };
    /* -------- */

    // ---- APIs ----
    const set: Result['set'] = (key, resultOrFunc): V => {
        const keyString = private_getKeyString(key);
        // Maybe we can use getValue here
        const maybeSnapshot = ref.value.get(keyString);
        const snapshot = maybeSnapshot === undefined ? private_getValueOrInitialValue(keyString) : maybeSnapshot;
        const result = getSetResult(resultOrFunc, snapshot);
        private_store_set(keyString, result);
        return result;
    };

    const reset: Result['reset'] = (key: K): void => {
        if (key === undefined) {
            deprecate('reset should be called with key, use resetAll to reset all keys.');
            private_store_resetAll();
        }
        const keyString = private_getKeyString(key);
        private_store_reset(keyString);
    };

    const resetAll: Result['resetAll'] = private_store_resetAll;

    // const emit: Result['emit'] = (key: K) => {
    //   const keyString = getKeyString(key);
    //   private_store_emit(keyString);
    // };
    //
    // const emitAll: Result['emitAll'] = private_store_emitAll;

    const skipByStrategy = (keyString: string, promise: Promise<V>): boolean => {
        // istanbul ignore next
        const promiseQueue = ref.promiseQueue.get(keyString) ?? [];
        if (strategy === 'acceptSequenced') {
            const index = promiseQueue.indexOf(promise);
            if (index === -1) {
                return true;
            }
            // invalid promises before this one while keep itself
            const nextPromiseQueue = promiseQueue.slice(index);
            ref.promiseQueue.set(keyString, nextPromiseQueue);
            return false;
        }
        return strategy === 'acceptLatest' && !isLatest(promiseQueue, promise);
    };

    const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
        key: K | ((params: TParams) => K),
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer?: (state: V, result: TResult, params: TParams) => V,
    ) => {
        const loadByReturnFunction = async (params?: TParams): Promise<void> => {
            // @ts-expect-error
            const loadKey: K = typeof key === 'function' ? key(params as TParams) : key;
            const keyString = private_getKeyString(loadKey);

            const promiseQueue = ref.promiseQueue.get(keyString);
            if (strategy === 'acceptFirst' && promiseQueue !== undefined) {
                await silent(promiseQueue[0]);
                return;
            }

            const promise = private_toPromise(asyncFunction, reducer, params, () => {
                const maybeSnapshot = ref.value.get(keyString);
                return maybeSnapshot === undefined ? private_getValueOrInitialValue(keyString) : maybeSnapshot;
            });
            private_store_loadStart(keyString, {promise});

            try {
                const result = await promise;
                if (skipByStrategy(keyString, promise)) {
                    private_store_loadEnd(keyString, {skip: true, promise});
                }
                else {
                    private_store_loadEnd(keyString, {skip: false, promise, value: result});
                }
            }
            catch (error: unknown) {
                if (skipByStrategy(keyString, promise)) {
                    private_store_loadEnd(keyString, {skip: true, promise});
                }
                else {
                    if (strategy === 'acceptFirst') {
                        ref.promiseQueue.delete(keyString);
                    }
                    private_store_setError(keyString, toError(error));
                }
            }
        };

        return loadByReturnFunction;
    };

    const load: Result['load'] = async (key, promise) => {
        if (promise instanceof Promise || typeof promise === 'function') {
            return loadBy(key, promise as never)();
        }
        console.warn('set result directly');
        return set(key, promise);
    };

    const getValue: Result['getValue'] = (key) => {
        const keyString = private_getKeyString(key);
        const maybeSnapshot = ref.value.get(keyString);
        return maybeSnapshot === undefined ? private_getValueOrInitialValue(keyString) : maybeSnapshot;
    };

    const getLoading: Result['getLoading'] = (key) => {
        const keyString = private_getKeyString(key);
        const pendingMutex = ref.pendingMutex.get(keyString);

        // treat undefined as true
        if (pendingMutex === undefined) {
            return option?.startLoadingWith ?? true;
        }
        return pendingMutex > 0;
    };

    const getError: Result['getError'] = (key) => {
        const keyString = private_getKeyString(key);
        return ref.error.get(keyString);
    };

    const getPromise: Result['getPromise'] = (key) => {
        const keyString = private_getKeyString(key);
        const promiseQueue = ref.promiseQueue.get(keyString);
        if (!promiseQueue) {
            return undefined;
        }
        return promiseQueue[promiseQueue.length - 1];
    };

    const createHooks = <TReturnType>(getFn: (key: K) => TReturnType) => {
        return (key: K): TReturnType => {
            const keyString = private_getKeyString(key);
            const subscription = useMemo(
                () => ({
                    getCurrentValue: () => getFn(key),
                    subscribe: (listener: Listener) => private_store_subscribe(keyString, listener),
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
                subscribe: (listener: Listener) => private_store_subscribe(keyString, listener),
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
            const snapshot = ref.value.get(keyString);
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
        set,
        reset,
        resetAll,
        // emit,
        // emitAll,
        load,
        loadBy,
        getValue,
        getLoading,
        getError,
        getPromise,
        useValue,
        useLoading,
        useError,
    };
}

export default createMappedRegion;
