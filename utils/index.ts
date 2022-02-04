export function isOdd(num: number): boolean {
    const oddChecker = num % 2;

    return oddChecker === 1 ? true : false;
}

export function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

import { useEffect } from 'react';
import Router from 'next/router';

export function useWarnIfUnsavedChanges(unsavedChanges: boolean, message: string): void {
    useEffect(() => {
        const routeChangeStart = (url: string) => {
            if (Router.asPath !== url && unsavedChanges && !confirm(message)) {
                Router.events.emit('routeChangeError');
                Router.replace(Router, Router.asPath);
                throw 'Abort route change. Please ignore this error.';
            }
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const beforeunload = (e) => {
            if (unsavedChanges) {
                e.preventDefault();
                e.returnValue = message;

                return message;
            }
        };

        window.addEventListener('beforeunload', beforeunload);
        Router.events.on('routeChangeStart', routeChangeStart);

        return () => {
            window.removeEventListener('beforeunload', beforeunload);
            Router.events.off('routeChangeStart', routeChangeStart);
        };
    }, [unsavedChanges, message]);
}
