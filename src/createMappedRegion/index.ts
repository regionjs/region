import {useMemo} from 'react';
import * as jsonStableStringify from 'json-stable-stringify';
import {useSubscription} from 'use-subscription';
import {deprecate} from '../util/deprecate';
import {ResultFunc, ResultFuncPure, Strategy, RegionOption, Listener} from '../types';

type IncreaseDecrease = (v: number | undefined) => number;
const increase: IncreaseDecrease = (v: number = 0) => (v + 1);
const decrease: IncreaseDecrease = (v: number = 0) => (v - 1 > 0 ? v - 1 : 0);

const formatLoading = (loading?: number) => {
    // treat undefined as true
    if (loading === undefined) {
        return true;
    }
    return loading > 0;
};

const getSetResult = <V>(resultOrFunc: V | ResultFuncPure<V>, snapshot: V) => {
    if (typeof resultOrFunc === 'function') {
        return (resultOrFunc as ResultFuncPure<V>)(snapshot);
    }
    return resultOrFunc;
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
    useData: {
        (key: K): V;
        <TResult>(key: K, selector: (value: V) => TResult): TResult;
    };
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
function createMappedRegion <K, V>(initialValue: void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V, option?: RegionOption): CreateMappedRegionPureReturnValue<K, V>;
function createMappedRegion <K, V>(initialValue: V | void | undefined, option?: RegionOption): CreateMappedRegionReturnValue<K, V> | CreateMappedRegionPureReturnValue<K, V> {
    type Result = CreateMappedRegionPureReturnValue<K, V>;

    const strategy: Strategy = option?.strategy ?? 'acceptLatest';

    interface PrivateStoreStateRef {
        pendingMutex: Map<string, number>;
        value: Map<string, V>;
        promise: Map<string, Promise<V>>;
        error: Map<string, Error>;
        listeners: Map<string, Set<Listener>>;
    }

    const ref: PrivateStoreStateRef = {
        pendingMutex: new Map<string, number>(),
        value: new Map<string, V>(),
        promise: new Map<string, Promise<V>>(),
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

    const private_store_load = (key: string, promise: Promise<V>): void => {
        ref.promise.set(key, promise);
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, increase(prevPendingMutex));
        private_store_emit(key);
    };

    const private_store_loadEnd = (key: string): void => {
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, decrease(prevPendingMutex));
        private_store_emit(key);
    };

    const private_store_set = (key: string, value: V): void => {
        const prevPendingMutex = ref.pendingMutex.get(key);
        ref.pendingMutex.set(key, decrease(prevPendingMutex));
        ref.value.set(key, value);
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
        ref.promise.delete(key);
        ref.error.delete(key);
        private_store_emit(key);
    };

    const private_store_resetAll = (): void => {
        // pendingMutex covers load/loadEnd/set/setError
        const keys = Array.from(ref.pendingMutex.keys());
        ref.pendingMutex.clear();
        ref.value.clear();
        ref.promise.clear();
        ref.error.clear();
        keys.forEach((key: string) => {
            private_store_emit(key);
        });
    };

    const private_store_subscribe = (key: string, listener: Listener): () => void => {
        if (!ref.listeners.get(key)) {
            ref.listeners.set(key, new Set());
        }

        if (typeof listener === 'function') {
            const listeners = ref.listeners.get(key);
            // since it is ensured
            listeners?.add(listener);
        } else {
            // istanbul ignore next
            console.warn(`listener should be function, but received ${listener}`);
        }

        return () => {
            const listeners = ref.listeners.get(key);
            listeners?.delete(listener);
        };
    };
    /* -------- */

    const getKeyString = (key: K | K[]): string => {
        if (typeof key === 'string') {
            return key;
        }
        // TODO remove after https://github.com/ecomfe/reskript/issues/271
        // @ts-expect-error
        // istanbul ignore next
        return key === undefined ? key : jsonStableStringify(key);
    };

    const getValueOrInitialValue = (value: V | undefined): V => {
        if (value !== undefined) {
            return value;
        }
        return initialValue as V;
    };

    // ---- APIs ----
    const set: Result['set'] = (key, resultOrFunc): V => {
        const keyString = getKeyString(key);
        // Maybe we can use getValue here
        const maybeSnapshot = ref.value.get(keyString);
        const snapshot = getValueOrInitialValue(maybeSnapshot);
        const result = getSetResult(resultOrFunc, snapshot);
        private_store_set(keyString, result);
        return result;
    };

    const reset: Result['reset'] = (key: K): void => {
        if (key === undefined) {
            deprecate('reset should be called with key, use resetAll to reset all keys.');
            private_store_resetAll();
        }
        const keyString = getKeyString(key);
        private_store_reset(keyString);
    };

    const resetAll: Result['resetAll'] = private_store_resetAll;

    // const emit: Result['emit'] = (key: K) => {
    //   const keyString = getKeyString(key);
    //   private_store_emit(keyString);
    // };
    //
    // const emitAll: Result['emitAll'] = private_store_emitAll;

    const private_toPromise = async <TParams, TResult>(
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer?: (state: V, result: TResult, params: TParams) => V,
        params?: TParams,
        // @ts-expect-error
        getReducerState: () => V
    ): Promise<V> => {
        // maybe promise, asyncFunction may return native value
        const promise = typeof asyncFunction === 'function' ? asyncFunction(params as TParams) : asyncFunction;
        if (typeof reducer === 'function') {
            const result = await promise;
            return reducer(getReducerState(), result, params as TParams);
        }
        return promise as unknown as Promise<V>;
    };

    const private_toError = (error: unknown): Error => {
        if (error instanceof Error) {
            return error;
        }
        if (typeof error === 'string') {
            return new Error(error);
        }
        return new Error(`You should throw an Error or a string to reject Promise, received ${error}`);
    };

    const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
        key: K | ((params: TParams) => K),
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer?: (state: V, result: TResult, params: TParams) => V
    ) => {
        const loadByReturnFunction = async (params?: TParams): Promise<void> => {
            // @ts-expect-error
            const loadKey = typeof key === 'function' ? key(params as TParams) : key;
            const keyString = getKeyString(loadKey);
            const promise = private_toPromise(asyncFunction, reducer, params, () => getValueOrInitialValue(ref.value.get(keyString)));
            private_store_load(keyString, promise);
            /**
             * note
             * 1. always get value after await, so it is the current one
             * 2. ensure if initialValue is gaven, every branch should return initialValueOfKey as T[K]
             */
            try {
                const result = await promise;
                const currentPromise = ref.promise.get(keyString);
                const snapshot = ref.value.get(keyString);

                if (strategy === 'acceptLatest' && promise !== currentPromise) {
                    // decrease loading & return snapshot
                    private_store_loadEnd(keyString);
                    return getValueOrInitialValue(snapshot) as never;
                }
                private_store_set(keyString, result);
                return getValueOrInitialValue(result) as never;
            } catch (error: unknown) {
                const currentPromise = ref.promise.get(keyString);
                const snapshot = ref.value.get(keyString);

                if (strategy === 'acceptLatest' && promise !== currentPromise) {
                    // decrease loading & return snapshot
                    private_store_loadEnd(keyString);
                    return getValueOrInitialValue(snapshot) as never;
                }
                private_store_setError(keyString, private_toError(error));
                return getValueOrInitialValue(snapshot) as never;
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

    const getValue: Result['getValue'] = key => {
        const keyString = getKeyString(key);
        const value = ref.value.get(keyString);
        return getValueOrInitialValue(value);
    };

    const getLoading: Result['getLoading'] = key => {
        const keyString = getKeyString(key);
        return formatLoading(ref.pendingMutex.get(keyString));
    };

    const getError: Result['getError'] = key => {
        const keyString = getKeyString(key);
        return ref.error.get(keyString);
    };

    const getPromise: Result['getPromise'] = key => {
        const keyString = getKeyString(key);
        const promise = ref.promise.get(keyString);
        return promise;
    };

    const createHooks = <TReturnType>(getFn: (key: K) => TReturnType) => {
        return (key: K): TReturnType => {
            const subscription = useMemo(
                () => ({
                    getCurrentValue: () => getFn(key),
                    subscribe: (listener: Listener) => private_store_subscribe(getKeyString(key), listener),
                }),
                // shallow-equal
                // eslint-disable-next-line react-hooks/exhaustive-deps
                [getKeyString(key)]
            );
            return useSubscription(subscription);
        };
    };

    const useValueSelectorSubscription = <TResult>(key: K, selector?: (value: V) => TResult) => {
        const subscription = useMemo(
            () => ({
                getCurrentValue: () => {
                    const value = getValue(key);
                    if (!value) {
                        return undefined;
                    }
                    return selector ? selector(value) : value;
                },
                subscribe: (listener: Listener) => private_store_subscribe(getKeyString(key), listener),
            }),
            // shallow-equal
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [selector, getKeyString(key)]
        );
        return subscription;
    };

    const useValue: Result['useValue'] = <TResult>(key: K, selector?: (value: V) => TResult) => {
        const subscription = useValueSelectorSubscription(key, selector);
        return useSubscription(subscription);
    };

    const useData: Result['useData'] = <TResult>(key: K, selector?: (value: V) => TResult) => {
        const subscription = useValueSelectorSubscription(key, selector);
        const currentPromise = useMemo(
            () => getPromise(key),
            // shallow-equal
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [getPromise, getKeyString(key)]
        );
        if (subscription.getCurrentValue() === undefined) {
            if (currentPromise) {
                throw currentPromise;
            } else {
                throw new Error('Doesn\'t found any work in progress load process');
            }
        }
        return useSubscription(subscription);
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
        useData,
    };
}

export default createMappedRegion;
