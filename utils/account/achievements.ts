import axios from 'axios';
import { errorHandler } from '../../middleware/errors';
import { Achievement, Objective } from '../../types/achievements';
import { parseAsArrayOfAchievements, parseAsArrayOfObjectives, safelyParse } from '../parsers';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';

export async function listAchievements(userId: string, isServer: boolean = false): Promise<Achievement[]> {
    const defaultAchievements: Achievement[] = [];
    const headers = isServer ? { 'Accept-Encoding': 'application/json' } : undefined;

    try {
        const res = await axios.get(`${URL}/api/achievements/list`, {
            params: {
                userId,
            },
            headers,
        });

        return safelyParse(res, 'data.achievements', parseAsArrayOfAchievements, defaultAchievements);
    } catch (error: unknown) {
        errorHandler(error, 'Could not find achievements.');
    }

    return defaultAchievements;
}

export async function listObjectives(userId: string, isServer: boolean = false): Promise<Objective[]> {
    const defaultObjectives: Objective[] = [];
    const headers = isServer ? { 'Accept-Encoding': 'application/json' } : undefined;

    try {
        const res = await axios.get(`${URL}/api/objectives/list`, {
            params: {
                userId,
            },
            headers,
        });

        return safelyParse(res, 'data.objectives', parseAsArrayOfObjectives, defaultObjectives);
    } catch (error: unknown) {
        errorHandler(error, 'Could not find objectives.');
    }

    return defaultObjectives;
}
