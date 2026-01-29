// useScrollIntoView.ts
import { useRef } from 'react';

export function useScrollIntoView<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    const scroll = (options?: ScrollIntoViewOptions) => {
        ref.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            ...options,
        });
    };

    return { ref, scroll };
}
