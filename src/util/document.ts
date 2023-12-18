import {useEffect} from 'react';

type Listener = (e: StorageEvent) => void;

const createStorageEventListenerHook = () => {
    const listeners = new Set<Listener>();
    const handleStorageEvent = (e: StorageEvent) => {
        // find some utils to test storage event
        // istanbul ignore next
        listeners.forEach(listener => {
            listener(e);
        });
    };
    const useEventListener = (listener: Listener) => {
        useEffect(
            () => {
                listeners.add(listener);
                return () => {
                    listeners.delete(listener);
                };
            },
            [listener]
        );
    };
    typeof window === 'object' && window.addEventListener('storage', handleStorageEvent);
    return useEventListener;
};

export const useStorageEvent = createStorageEventListenerHook();
