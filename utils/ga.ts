/* import Cookies from 'js-cookie';

import * as ga from '../lib/ga';
import { gaParams } from '../types/ga';

export function gaEvent(action: string, params: gaParams): void {
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    if (cookieConsent) {
        ga.event({
            action,
            params,
        });
    }
}
 */

export {};
