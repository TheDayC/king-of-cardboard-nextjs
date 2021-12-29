/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types,@typescript-eslint/ban-ts-comment */
import { useState, useRef, useEffect, useCallback } from 'react';

import { ContentfulPage } from '../types/pages';
import { fetchContent } from './content';
import { parseAsArrayOfContentfulPages, safelyParse } from './parsers';

export async function fetchPageCollection(query: string): Promise<ContentfulPage[] | null> {
    const pages = await fetchContent(query);

    return safelyParse(pages, 'data.content.pagesCollection.items', parseAsArrayOfContentfulPages, null);
}

export const useRecursiveTimeout = (callback: any, delay: number): any => {
    const [isRunning, setIsRunning] = useState(false);
    const stop = useCallback(() => setIsRunning(false), [setIsRunning]);
    const play = useCallback(() => setIsRunning(true), [setIsRunning]);
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!isRunning) return;
        let id = 0;

        const tick = () => {
            if (!isRunning) return clearTimeout(id);
            savedCallback.current();
            // @ts-ignore
            requestAnimationFrame(() => (id = setTimeout(tick, delay)));
        };

        // @ts-ignore
        requestAnimationFrame(() => (id = setTimeout(tick, delay)));

        return () => {
            if (id) clearTimeout(id);
            stop();
        };
    }, [isRunning, delay, stop]);

    return { play, stop };
};
