import { round } from 'lodash';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export function progressColour(max: number, current: number): string {
    const quarter = round(max * 0.25, 2);
    const half = round(max * 0.5, 2);
    const threeQuarters = round(max * 0.75, 2);

    if (current <= 0 || current < quarter) {
        return 'rgb(202 138 4)';
    }

    if (current >= quarter && current < half) {
        return 'rgb(156 163 175)';
    }

    if (current >= half && current < threeQuarters) {
        return '#f6c467';
    }

    if (current >= threeQuarters && current < max) {
        return '#60c7f2';
    }

    if (current >= max) {
        return '#C365F6';
    }

    return '#ff5724';
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
