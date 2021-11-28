import axios from 'axios';
import { round } from 'lodash';

import { parseAsNumber, safelyParse } from './parsers';

export async function getGiftCardBalance(accessToken: string, emailAddress: string): Promise<number | null> {
    try {
        const response = await axios.post('/api/achievements/getGiftCardBalance', {
            token: accessToken,
            emailAddress,
        });

        if (response) {
            return safelyParse(response, 'data.balance', parseAsNumber, null);
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export function progressColour(max: number, current: number): string {
    const quarter = round(max * 0.25, 2);
    const half = round(max * 0.5, 2);
    const threeQuarters = round(max * 0.75, 2);

    if (current <= 0 || current < quarter) {
        return 'error';
    }

    if (current >= quarter && current < half) {
        return 'warning';
    }

    if (current >= half && current < threeQuarters) {
        return 'info';
    }

    if (current >= threeQuarters && current < max) {
        return 'success';
    }

    if (current >= max) {
        return 'accent';
    }

    return 'error';
}

export function nextMilestone(milestone: number, max: number, current: number): number {
    // Create an array filled with numbers based on the max achievement count.
    const allNumbers = Array.from({ length: max }).map((cur, i) => i);

    // Filter all numbers not divisible by the milestone and remove 0.
    const divisible = allNumbers.filter((cur) => !(cur % milestone) && cur !== 0);

    // Find anything that is greater than the current value so the highest next milestone will always be first in the array.
    // NOTE: We intentionally use >= here so we can figure out if we're currently on a milestone.
    const greaterThan = divisible.filter((cur) => cur >= current);

    // If there are elements in greaterThan then we're still progressing, else we're one milestone away from max.
    return greaterThan.length > 0 ? greaterThan[0] : max;
}
