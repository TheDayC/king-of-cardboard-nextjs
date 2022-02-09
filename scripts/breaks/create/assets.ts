import { createClient } from 'contentful-management';
import path from 'path';
import { replace } from 'lodash';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.scripts') });

import { errorHandler } from '../../../middleware/errors';
import { Teams, Team } from '../../types';

const accessToken = process.env.CONTENTFUL_MANAGE_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
const env = 'master';
const enGB = 'en-GB';

export async function createAssets(
    sku: string,
    assetsOptions: object,
    teams: Teams,
    breakNumber: number,
    isRandom: boolean
): Promise<Team[] | null> {
    try {
        const client = createClient({
            // This is the access token for this space. Normally you get the token in the Contentful web app
            accessToken,
        });

        // This API call will request a space with the specified ID
        const space = await client.getSpace(spaceId);

        // This API call will request an environment with the specified ID
        const environment = await space.getEnvironment(env);
        const assets = await environment.getAssets(assetsOptions);

        if (isRandom) {
            const firstAsset = assets.items[0];
            const randomImg = `https:${firstAsset.fields.file[enGB].url}`;
            const randomValues = Object.values(teams);

            return randomValues.map((slot) => ({
                ...slot,
                sku: sku.replace('{{CODEANDNAME}}', slot.code.toUpperCase()),
                name: `${slot.name} (Break ${breakNumber})`,
                image_id: firstAsset.sys.id,
                image_url: randomImg,
            }));
        } else {
            return assets.items
                .filter((asset) => Object(teams).hasOwnProperty(asset.fields.title[enGB]))
                .map((asset) => {
                    const team = teams[asset.fields.title[enGB]];

                    return {
                        ...team,
                        sku: sku.replace('{{CODEANDNAME}}', team.code.toUpperCase()),
                        name: `${team.name} (Break ${breakNumber})`,
                        image_id: asset.sys.id,
                        image_url: `https:${asset.fields.file[enGB].url}`,
                    };
                })
                .sort((a, b) => a.name.localeCompare(b.name));
        }
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return null;
}
