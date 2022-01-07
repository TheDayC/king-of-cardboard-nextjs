import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';

import { SessionReturn } from '../types/auth';

export function useCustomSession(): SessionReturn {
    const cookieConsent = Boolean(Cookies.get('cookieConsent'));

    if (!cookieConsent) {
        return {
            data: null,
            status: 'unauthenticated',
        };
    }

    // Only called conditionally based on a refresh, should be fine.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSession();
}
