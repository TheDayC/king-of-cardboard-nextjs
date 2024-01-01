/* import { gaParams } from '../../types/ga';

interface GtagData {
    action: string;
    params: gaParams;
} */

// log the pageview with their URL
/* export const pageview = (url: string): void => {
    const id = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

    if (!id || !window.gtag) return;

    window.gtag('config', id, { page_path: url });
}; */

// log specific events happening.
/* export const event = (data: GtagData): void => {
    const { action, params } = data;

    if (!window.gtag) return;

    window.gtag('event', action, params);
}; */

export {};
