// public
export type Strategy = 'acceptFirst' | 'acceptLatest' | 'acceptEvery' | 'acceptSequenced';

export interface RegionOption {
    strategy: Strategy;
}

// set & load
// set
export type ResultFunc<V> = (snapshot?: V) => V;
export type ResultFuncPure<V> = (snapshot: V) => V;

// internal
export type Listener = () => void;
