import { createClient } from 'contentful-management';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { errorHandler } from '../middleware/errors';
import { Team } from './types';

const accessToken = process.env.CONTENTFUL_MANAGE_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
const env = 'master';
const enGB = 'en-GB';

export async function createBreakSlots(teams: Team[], tags: string[]): Promise<string[]> {
    const entryIds: string[] = [];

    try {
        const client = createClient({
            // This is the access token for this space. Normally you get the token in the Contentful web app
            accessToken,
        });

        // This API call will request a space with the specified ID
        const space = await client.getSpace(spaceId);

        // This API call will request an environment with the specified ID
        const environment = await space.getEnvironment(env);

        for (const team of teams) {
            console.log(`Creating break slot ${team.code}`);
            const entry = await environment.createEntry('slots', {
                fields: {
                    name: {
                        [enGB]: team.name,
                    },
                    productLink: {
                        [enGB]: team.code,
                    },
                    image: {
                        [enGB]: {
                            sys: {
                                id: team.image_id,
                                linkType: 'Asset',
                                type: 'Link',
                            },
                        },
                    },
                },
                metadata: {
                    tags: tags.map((tag) => ({
                        sys: {
                            type: 'Link',
                            linkType: 'Tag',
                            id: tag,
                        },
                    })),
                },
            });

            entry.publish();

            entryIds.push(entry.sys.id);
            console.log(`Published break slot ${entry.sys.id}`);
        }

        return entryIds;
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return entryIds;
}
