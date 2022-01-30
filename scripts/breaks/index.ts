import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { nbaTeams } from './data/nba';
import { nflTeams } from './data/nfl';
import { eslTeams } from './data/esl';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createBreaks } from './create/breaks';
import { createBreakSlots } from './create/slots';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'esl,logos',
};
const sku = 'BREAK-3-{{CODEANDNAME}}';
const title = 'ESL CSGO Set B';
const slug = 'esl-csgo-set-b-break-3';
const cardImage = '1fVIaqvQtUdDV8V2knu7Iu';
const type = 'esports';
const date = '2022-02-24T19:00:00';
const format = 'Pick Your Team';
const breakTags = ['Entry', 'Enthusiast'];
const slotTags = ['esl', 'slot'];
const breakNumber = 3;

async function generateBreaks(): Promise<void> {
    // Create the teams for this break.
    const teams = await createAssets(sku, assetsOptions, eslTeams);

    if (!teams) return;

    // Create the skus based on the teams data in commerce layer.
    const skusWithIds = await createSkus(teams);

    if (skusWithIds.length < 0) return;

    // Create the slots in Contentful
    const slots = await createBreakSlots(teams, slotTags);

    if (slots.length <= 0) return;

    // Create the break in Contentful and link all slots.
    await createBreaks(title, slug, cardImage, type, date, format, breakTags, slots, breakNumber);
}

generateBreaks();
