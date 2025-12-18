import {createMappedRegion, MappedRegionInitialized} from './createMappedRegion.js';
import {Listener, RegionOption, ResultFuncUninitialized, ResultFuncInitialized} from './types.js';

interface LoadBy<V, Extend> {
    (
        asyncFunction: () => Promise<V>,
    ): () => Promise<void>;
    <TResult = unknown>(
        asyncFunction: () => Promise<TResult>,
        reducer: (state: V | Extend, result: TResult) => V,
    ): () => Promise<void>;
    <TParams = void>(
        asyncFunction: (params: TParams) => Promise<V>,
    ): (params: TParams) => Promise<void>;
    <TParams = void, TResult = unknown>(
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer: (state: V | Extend, result: TResult, params: TParams) => V,
    ): (params: TParams) => Promise<void>;
}

export interface RegionUninitialized<V> {
    set: (resultOrFunc: V | ResultFuncUninitialized<V>) => void;
    setValue: (resultOrFunc: V | ResultFuncUninitialized<V>) => void;
    reset: () => void;
    emit: () => void;
    subscribe: (listener: Listener) => void;
    load: (promise: Promise<V>) => Promise<void>;
    loadBy: LoadBy<V, undefined>;
    get: () => V | undefined;
    getValue: () => V | undefined;
    getLoading: () => boolean;
    getError: () => Error | undefined;
    getPromise: () => Promise<V> | undefined;
}

export interface RegionInitialized<V> extends Omit<RegionUninitialized<V>, 'set' | 'loadBy' | 'getValue'> {
    set: (resultOrFunc: V | ResultFuncInitialized<V>) => void;
    setValue: (resultOrFunc: V | ResultFuncInitialized<V>) => void;
    loadBy: LoadBy<V, never>;
    get: () => V;
    getValue: () => V;
}

// overload is unsafe in some way, ensure the return type is correct
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function createRegion<V>(initialValue: void | undefined, option?: RegionOption): RegionUninitialized<V>;
export function createRegion<V>(initialValue: V, option?: RegionOption): RegionInitialized<V>;
export function createRegion<V>(initialValue: void | V | undefined, option?: RegionOption): RegionUninitialized<V> | RegionInitialized<V> {
    type Result = RegionInitialized<V>;

    const region = createMappedRegion<'value', V>(initialValue as V, option) as MappedRegionInitialized<'value', V>;

    const setValue: Result['setValue'] = (resultOrFunc: V | ResultFuncInitialized<V>) => {
        return region.set('value', resultOrFunc);
    };

    const reset: Result['reset'] = () => {
        return region.reset('value');
    };

    const emit: Result['emit'] = () => {
        return region.emit('value');
    };

    const subscribe: Result['subscribe'] = (listener: Listener) => {
        return region.subscribe('value', listener);
    };

    const load: Result['load'] = (promise) => {
        return region.load('value', promise);
    };

    const loadBy: Result['loadBy'] = <TParams = void, TResult = unknown>(
        asyncFunction: (params: TParams) => Promise<TResult>,
        reducer?: (state: V, result: TResult, params: TParams) => V,
    ) => {
        // type actually strict, it is loose when developed
        // @ts-expect-error
        return region.loadBy('value', asyncFunction, reducer);
    };

    const getValue: Result['getValue'] = () => {
        return region.getValue('value');
    };

    const getLoading: Result['getLoading'] = () => {
        return region.getLoading('value');
    };

    const getError: Result['getError'] = () => {
        return region.getError('value');
    };

    const getPromise: Result['getPromise'] = () => {
        return region.getPromise('value');
    };

    return {
        set: setValue,
        setValue,
        reset,
        emit,
        subscribe,
        load,
        loadBy,
        get: getValue,
        getValue,
        getLoading,
        getError,
        getPromise,
    };
}
