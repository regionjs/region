// public
export type Strategy = 'acceptLatest' | 'acceptEvery';

export interface RegionOption {
    strategy: Strategy;
}

// set & load
// set
export type ResultFunc<V> = (snapshot?: V) => V;
export type ResultFuncPure<V> = (snapshot: V) => V;

// internal
export type Listener = () => void;

export interface Props<V> {
    pendingMutex?: number;
    value?: V;
    promise?: Promise<V>;
    error?: Error;
    listeners?: Listener[];
}
