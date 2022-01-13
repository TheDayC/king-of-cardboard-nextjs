import { createClient } from 'contentful-management';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { errorHandler } from '../middleware/errors';

const accessToken = process.env.CONTENTFUL_MANAGE_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
const env = 'master';
const enGB = 'en-GB';

export async function createBreaks(
    title: string,
    slug: string,
    cardImage: string,
    type: string,
    date: string,
    format: string,
    tags: string[],
    slots: string[]
): Promise<void> {
    try {
        console.log('Created a new break...');
        const client = createClient({
            // This is the access token for this space. Normally you get the token in the Contentful web app
            accessToken,
        });

        // This API call will request a space with the specified ID
        const space = await client.getSpace(spaceId);

        // This API call will request an environment with the specified ID
        const environment = await space.getEnvironment(env);

        const entry = await environment.createEntry('breaks', {
            fields: {
                internalTitle: {
                    [enGB]: title,
                },
                title: {
                    [enGB]: title,
                },
                slug: {
                    [enGB]: slug,
                },
                cardImage: {
                    [enGB]: {
                        sys: {
                            id: cardImage,
                            linkType: 'Asset',
                            type: 'Link',
                        },
                    },
                },
                types: {
                    [enGB]: type,
                },
                breakDate: {
                    [enGB]: date,
                },
                tags: {
                    [enGB]: tags,
                },
                format: {
                    [enGB]: format,
                },
                breakSlots: {
                    [enGB]: slots,
                    [enGB]: slots.map((slot) => ({
                        sys: {
                            type: 'Link',
                            linkType: 'Entry',
                            id: slot,
                        },
                    })),
                },
                isLive: {
                    [enGB]: false,
                },
                isComplete: {
                    [enGB]: false,
                },
                vodLink: {
                    [enGB]: '',
                },
            },
        });

        entry.publish();
        console.log(`Created break ${entry.sys.id}`);
    } catch (err: unknown) {
        console.log('🚀 ~ file: createBreaks.ts ~ line 80 ~ createBreaks ~ err', err);
        errorHandler(err, 'An error occurred.');
    }
}
