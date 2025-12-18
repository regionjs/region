import {createMappedRegion, MappedRegionInitialized} from './createMappedRegion.js';
import type {
    RegionUninitialized as CoreRegionUninitialized,
    RegionInitialized as CoreRegionInitialized,
} from 'region-core';
import {Listener, RegionOption, ResultFuncInitialized} from 'region-core/es/types.js';

export interface RegionUninitialized<V> extends CoreRegionUninitialized<V> {
    use: {
        (): V | undefined;
        <TResult>(selector: (value: V | undefined) => TResult): TResult;
    };
    useValue: {
        (): V | undefined;
        <TResult>(selector: (value: V | undefined) => TResult): TResult;
    };
    useLoading: () => boolean;
    useError: () => Error | undefined;
}

export interface RegionInitialized<V> extends CoreRegionInitialized<V> {
    use: {
        (): V;
        <TResult>(selector: (value: V) => TResult): TResult;
    };
    useValue: {
        (): V;
        <TResult>(selector: (value: V) => TResult): TResult;
    };
    useLoading: () => boolean;
    useError: () => Error | undefined;
}

// overload is unsafe in some way, ensure the return type is correct
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export function createRegion<V>(initialValue: void | undefined, option?: RegionOption): RegionUninitialized<V>;
export function createRegion<V>(initialValue: V, option?: RegionOption): RegionInitialized<V>;
export function createRegion<V>(initialValue: void | V | undefined, option?: RegionOption): RegionUninitialized<V> | RegionInitialized<V> {
    type Result = RegionUninitialized<V>;

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

    const useValue: Result['useValue'] = <TResult>(selector?: (value: V) => TResult) => {
        // type actually strict, it is loose when developed
        // @ts-expect-error
        return region.useValue('value', selector);
    };

    const useLoading: Result['useLoading'] = () => {
        return region.useLoading('value');
    };

    const useError: Result['useError'] = () => {
        return region.useError('value');
    };

    return {
        set: setValue,
        setValue,
        reset,
        load,
        loadBy,
        emit,
        subscribe,
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
