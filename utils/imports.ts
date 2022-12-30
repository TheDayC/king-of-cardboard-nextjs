import { round } from 'lodash';

export function getPercentageChange(previous: number, current: number): number {
    const decreaseValue = current - previous;

    return round((decreaseValue / previous) * 100, 2);
}
