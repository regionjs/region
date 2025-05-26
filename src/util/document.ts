import {RefObject, useEffect, useRef} from 'react';

type Listener = (e: StorageEvent) => void;

const createStorageEventListenerHook = () => {
    const listeners = new Set<RefObject<Listener>>();
    const handleStorageEvent = (e: StorageEvent) => {
        // find some utils to test storage event
        // istanbul ignore next
        listeners.forEach((listener) => {
            listener.current?.(e);
        });
    };
    const useEventListener = (listener: Listener) => {
        const listenerRef = useRef(listener);
        listenerRef.current = listener;

        useEffect(
            () => {
                listeners.add(listenerRef);
                return () => {
                    listeners.delete(listenerRef);
                };
            },
            [],
        );
    };
    typeof window === 'object' && window.addEventListener('storage', handleStorageEvent);
    return useEventListener;
};

export const useStorageEvent = createStorageEventListenerHook();
