import { createClient } from 'contentful-management';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { errorHandler } from '../../../middleware/errors';
import { Card, SkusWithIds } from '../../types';

const accessToken = process.env.CONTENTFUL_MANAGE_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
const env = 'master';
const enGB = 'en-GB';

export async function createSingles(cards: Card[], skuWithIds: SkusWithIds[]): Promise<void> {
    try {
        const client = createClient({
            // This is the access token for this space. Normally you get the token in the Contentful web app
            accessToken,
        });

        // This API call will request a space with the specified ID
        const space = await client.getSpace(spaceId);

        // This API call will request an environment with the specified ID
        const environment = await space.getEnvironment(env);

        for (const card of cards) {
            const skuWithId = skuWithIds.find((sku) => sku.code === card.sku) || null;

            if (skuWithId) {
                const entry = await environment.createEntry('product', {
                    fields: {
                        name: {
                            [enGB]: card.title,
                        },
                        slug: {
                            [enGB]: card.sku.toLowerCase(),
                        },
                        cardImage: {
                            [enGB]: {
                                sys: {
                                    id: card.image_id,
                                    linkType: 'Asset',
                                    type: 'Link',
                                },
                            },
                        },
                        description: {
                            [enGB]: '',
                        },
                        productLink: {
                            [enGB]: card.sku,
                        },
                        types: {
                            [enGB]: card.types,
                        },
                        categories: {
                            [enGB]: card.categories,
                        },

                        tags: {
                            [enGB]: card.tags,
                        },
                    },
                });

                entry.publish();
                console.log(`Created single ${entry.sys.id}`);
            }
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }
}
