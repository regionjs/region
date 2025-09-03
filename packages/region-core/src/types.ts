// public
export type Strategy = 'acceptFirst' | 'acceptLatest' | 'acceptEvery' | 'acceptSequenced';

export interface RegionOption {
    withLocalStorageKey?: string;
    strategy?: Strategy;
    startLoadingWith?: boolean;
    syncLocalStorageFromEvent?: boolean;
}

// set & load
// set
export type ResultFuncUninitialized<V> = (snapshot?: V) => V;
export type ResultFuncInitialized<V> = (snapshot: V) => V;

// internal
export type Listener = () => void;
