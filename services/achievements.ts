import { LineItem } from '@commercelayer/sdk';
import axios from 'axios';

import {
    Achievement,
    CategoriesAndTypes,
    RecalculateAchievements,
    FetchAchievements,
    FetchObjectives,
    Objective,
} from '../types/achievements';
import { authClient } from '../utils/auth';
import {
    parseAsArrayOfAchievements,
    parseAsArrayOfObjectives,
    parseAsArrayOfStrings,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../utils/parsers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

function hasReachedMinThreshold(current: number, min: number): boolean {
    return current === min;
}

function hasReachedMilestone(current: number, milestone: number): boolean {
    return current % milestone === 0;
}

function hasExceededMaxThreshold(current: number, max: number): boolean {
    return current > max;
}

export async function updateAchievements(
    accessToken: string,
    giftCardId: string,
    emailAddress: string,
    achievements: Achievement[],
    points: number
): Promise<void> {
    const cl = authClient(accessToken);

    await cl.patch(`/api/gift_cards/${giftCardId}`, {
        data: {
            type: 'gift_cards',
            id: giftCardId,
            attributes: {
                _balance_change_cents: points,
            },
        },
    });

    await axios.post(`${SITE_URL}/api/achievements/updateAchievements`, {
        emailAddress,
        achievements,
    });
}

export async function fetchAchievements(emailAddress: string, accessToken: string): Promise<FetchAchievements> {
    const response = await axios.post(`${SITE_URL}/api/achievements/getAchievements`, { emailAddress, accessToken });

    return {
        giftCardId: safelyParse(response, 'data.giftCardId', parseAsString, null),
        achievements: safelyParse(response, 'data.achievements', parseAsArrayOfAchievements, null),
    };
}

export async function fetchObjectives(
    categories: string[] | null,
    types: string[] | null,
    page: number = 0
): Promise<FetchObjectives> {
    const response = await axios.post(`${SITE_URL}/api/achievements/getObjectives`, {
        categories,
        types,
        page,
    });

    return {
        objectives: safelyParse(response, 'data.objectives', parseAsArrayOfObjectives, [] as Objective[]),
        count: safelyParse(response, 'data.count', parseAsNumber, 0),
    };
}

export function getCategoriesAndTypes(items: LineItem[]): CategoriesAndTypes {
    const categories: string[] = [];
    const types: string[] = [];

    items.forEach((item) => {
        const cats = safelyParse(item, 'metadata.categories', parseAsArrayOfStrings, null);
        const tempTypes = safelyParse(item, 'metadata.types', parseAsArrayOfStrings, null);

        if (cats) {
            cats.forEach((cat) => categories.push(cat));
        }

        if (tempTypes) {
            tempTypes.forEach((type) => types.push(type));
        }
    });

    return { categories, types };
}

export function createInitialAchievements(objectives: Objective[]): RecalculateAchievements {
    const points = objectives
        .map((objective) => {
            const current = 1;
            const { min, milestone, reward, milestoneMultiplier: multiplier } = objective;
            const milestoneReward = reward * multiplier;
            const shouldGetMilestoneReward =
                hasReachedMinThreshold(current, min) || hasReachedMilestone(current, milestone);

            // Check to see if we've hit our min threshold.
            if (shouldGetMilestoneReward) {
                return milestoneReward;
            }

            return reward;
        })
        .reduce((previous, current) => previous + current);

    return {
        points,
        achievements: objectives.map((objective) => ({ id: objective._id, current: 1 })),
    };
}

export function calculateAchievements(objectives: Objective[], achievements: Achievement[]): RecalculateAchievements {
    const points = objectives
        .map((objective) => {
            const { _id, min, max, milestone, reward, milestoneMultiplier: multiplier } = objective;
            const achievement = achievements.find((a) => a.id === _id) || null;

            if (achievement) {
                const newAmount = achievement.current + 1;
                const milestoneReward = reward * multiplier;

                if (!hasExceededMaxThreshold(newAmount, max)) {
                    // Check to see if we've hit our min threshold.
                    if (hasReachedMinThreshold(newAmount, min) || hasReachedMilestone(newAmount, milestone)) {
                        return milestoneReward;
                    }

                    return reward;
                }
            }

            return 0;
        })
        .reduce((previous, current) => previous + current);

    const newAchievements = objectives
        .map((objective) => {
            const { _id, max } = objective;
            const achievement = achievements.find((a) => a.id === _id) || null;

            if (achievement) {
                // If the current achievement already exists then increment the count.
                const current = achievement.current + 1;

                // If we've not exceeded the max on the current increment then override the achievement's current value.
                if (!hasExceededMaxThreshold(current, max)) {
                    return {
                        ...achievement,
                        current,
                    };
                }

                return achievement;
            }

            return null;
        })
        .filter((value): value is Achievement => value !== null);

    return {
        points,
        achievements: newAchievements,
    };
}
