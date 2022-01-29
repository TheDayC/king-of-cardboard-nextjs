import { createClient } from 'contentful-management';
import path from 'path';
import { replace } from 'lodash';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { errorHandler } from '../../../middleware/errors';
import { Teams, Team } from '../../types';

const accessToken = process.env.CONTENTFUL_MANAGE_TOKEN || '';
const spaceId = process.env.CONTENTFUL_SPACE_ID || '';
const env = 'master';
const enGB = 'en-GB';

export async function createAssets(sku: string, assetsOptions: object, teams: Teams): Promise<Team[] | null> {
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

        return assets.items
            .filter((asset) => Object(teams).hasOwnProperty(asset.fields.title[enGB]))
            .map((asset) => {
                const team = teams[asset.fields.title[enGB]];
                const name = team.name.split(' ').join('-');

                return {
                    ...team,
                    sku: sku.replace('{{CODEANDNAME}}', team.code.toUpperCase()),
                    name: team.name,
                    image_id: asset.sys.id,
                    image_url: `https:${asset.fields.file[enGB].url}`,
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    } catch (err: unknown) {
        errorHandler(err, 'An error occurred.');
    }

    return null;
}
