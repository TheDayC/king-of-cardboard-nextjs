import { LineItem } from '@commercelayer/sdk';

import { Achievement, CategoriesAndTypes, RecalculateAchievements, Objective } from '../types/achievements';
import { parseAsArrayOfStrings, safelyParse } from '../utils/parsers';

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
