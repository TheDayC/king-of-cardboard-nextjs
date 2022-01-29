import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { nbaTeams } from './data/basketball';
import { nflTeams } from './data/football';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createBreaks } from './create/breaks';
import { createBreakSlots } from './create/slots';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'nfl,logos',
};
const sku = 'BREAK-1-{{CODEANDNAME}}';
const title = 'NFL Donruss Hobby 2021 - Break 1';
const slug = 'nfl-donruss-hobby-2021-break-1';
const cardImage = '2mK1clbMq5MH6SX3NmhroN';
const type = 'football';
const date = '2022-02-13T17:00:00';
const format = 'Pick Your Team';
const breakTags = ['High End'];
const slotTags = ['nfl', 'break', 'football'];

async function generateBreaks(): Promise<void> {
    // Create the teams for this break.
    const teams = await createAssets(sku, assetsOptions, nflTeams);

    if (!teams) return;

    // Create the skus based on the teams data in commerce layer.
    const skusWithIds = await createSkus(teams);

    if (skusWithIds.length < 0) return;

    // Create the slots in Contentful
    const slots = await createBreakSlots(teams, slotTags);

    if (slots.length <= 0) return;

    // Create the break in Contentful and link all slots.
    await createBreaks(title, slug, cardImage, type, date, format, breakTags, slots);
}

generateBreaks();
