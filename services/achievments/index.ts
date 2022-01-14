import axios from 'axios';
import { Session } from 'next-auth';

import { errorHandler } from '../../middleware/errors';
import { Achievement, ObjectId, Objective } from '../../types/achievements';
import { authClient } from '../../utils/auth';
import {
    parseAsArrayOfAchievements,
    parseAsArrayOfObjectives,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../utils/parsers';

class Achievements {
    private _email: string | null = null;
    private _accessToken: string | null = null;
    private _objectives: Objective[] | null = null;
    private _objectives_count: number = 0;
    private _achievements: Achievement[] | null = null;
    private _giftCardId: string | null = null;
    private _points: number = 0;

    constructor(session: Session | null, accessToken: string | null) {
        this._email = safelyParse(session, 'user.email', parseAsString, null);
        this._accessToken = accessToken;

        this.fetchAchievments();
    }

    private hasReachedMinThreshold(current: number, min: number): boolean {
        return current === min;
    }

    private hasExceededMaxThreshold(current: number, max: number): boolean {
        return current > max;
    }

    private hasReachedMilestone(current: number, milestone: number): boolean {
        return current % milestone === 0;
    }

    private async fetchAchievments(): Promise<void> {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/achievements/getAchievements`, {
                emailAddress: this._email,
                accessToken: this._accessToken,
            });

            if (response) {
                this._giftCardId = safelyParse(response, 'data.giftCardId', parseAsString, null);
                this._achievements = safelyParse(response, 'data.achievements', parseAsArrayOfAchievements, null);
            } else {
                this._achievements = null;
                this._giftCardId = null;
            }
        } catch (error: unknown) {
            errorHandler(error, 'Failed to fetch achievements.');
        }

        return;
    }

    public async fetchObjectives(
        categories: string[] | null = null,
        types: string[] | null = null,
        page: number = 0
    ): Promise<boolean> {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/achievements/getObjectives`, {
                categories,
                types,
                page,
            });

            if (response) {
                this._objectives = safelyParse(response, 'data.objectives', parseAsArrayOfObjectives, null);
                this._objectives_count = safelyParse(response, 'data.count', parseAsNumber, 0);

                return true;
            } else {
                this._objectives = null;
            }
        } catch (error: unknown) {
            errorHandler(error, 'Failed to fetch objectives.');
        }

        return false;
    }

    public async updateAchievements(): Promise<void> {
        try {
            const cl = authClient(this._accessToken);
            await cl.patch(`/api/gift_cards/${this._giftCardId}`, {
                data: {
                    type: 'gift_cards',
                    id: this._giftCardId,
                    attributes: {
                        _balance_change_cents: this._points,
                    },
                },
            });

            await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/achievements/updateAchievements`, {
                emailAddress: this._email,
                achievements: this._achievements,
            });
        } catch (error: unknown) {
            errorHandler(error, 'Failed to update achievements.');
        }
    }

    public incrementAchievement(
        id: ObjectId,
        min: number,
        max: number,
        reward: number,
        milestone: number,
        multiplier: number
    ): void {
        // For milestones we want to give a slightly larger reward.
        const milestoneReward = reward * multiplier;

        if (this._achievements) {
            const achievementIndex = this._achievements.findIndex((achievement) => achievement.id === id) || null;

            if (achievementIndex) {
                // If the current achievement already exists then increment the count.
                const currentAchievement = this._achievements[achievementIndex];
                const current = currentAchievement.current + 1;

                // If we've not exceeded the max on the current increment then dish out points.
                if (!this.hasExceededMaxThreshold(current, max)) {
                    // Update the achievement array with our new total.
                    this._achievements[achievementIndex] = {
                        ...currentAchievement,
                        current,
                    };

                    // Check to see if we've hit our min threshold.
                    if (this.hasReachedMinThreshold(current, min)) {
                        this._points = this._points + milestoneReward;
                    } else if (this.hasReachedMilestone(current, milestone)) {
                        // Check if we've reached a milestone.
                        this._points = this._points + milestoneReward;
                    } else {
                        // Apply basic reward.
                        this._points = this._points + reward;
                    }
                }
            }
        } else {
            const current = 1;

            this._achievements = [{ id, current }];

            // Check to see if we've hit our min threshold.
            if (this.hasReachedMinThreshold(current, min)) {
                this._points = this._points + milestoneReward;
            } else if (this.hasReachedMilestone(current, milestone)) {
                // Check if we've reached a milestone.
                this._points = this._points + milestoneReward;
            } else {
                // Apply basic reward.
                this._points = this._points + reward;
            }
        }
    }

    set objectives(objectives: Objective[] | null) {
        this._objectives = objectives;
    }

    get objectives(): Objective[] | null {
        return this._objectives;
    }

    get objectivesCount(): number {
        return this._objectives_count;
    }

    get achievements(): Achievement[] | null {
        return this._achievements;
    }
}

export default Achievements;
