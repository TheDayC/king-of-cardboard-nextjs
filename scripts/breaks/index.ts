import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env.scripts') });

import { nbaTeams } from './data/nba';
import { nflTeams } from './data/nfl';
import { eslTeams } from './data/esl';
import { uefaMerlinTeams } from './data/uefa-merlin';
import { uefaStadiumTeams } from './data/uefa-stadium';
import { worldCupTeams } from './data/world-cup';
import { randomTeams } from './data/random';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createBreaks } from './create/breaks';
import { createBreakSlots } from './create/slots';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'random,logos',
};

const breakNumber = 6;
const sku = `BREAK-${breakNumber}-{{CODEANDNAME}}`;
const title = 'Donruss Elite FOTL Hobby 21/22';
const slug = 'donruss-elite-fotl-hobby-21-22';
const cardImage = '6bI0mQMEwH70f3Y8lsYOpi';
const type = 'basketball';
const date = '2022-03-05T17:00:00';
const format = 'Random Teams';
const breakTags = ['Luxury', 'High Hit Chance'];
const slotTags = ['basketball', 'nba', 'slot'];

async function generateBreaks(): Promise<void> {
    // Create the teams for this break.
    const teams = await createAssets(sku, assetsOptions, randomTeams, breakNumber, true);

    if (!teams) return;

    // Create the skus based on the teams data in commerce layer.
    const skusWithIds = await createSkus(teams, breakNumber);

    if (skusWithIds.length < 0) return;

    // Create the slots in Contentful
    const slots = await createBreakSlots(teams, slotTags);

    if (slots.length <= 0) return;

    // Create the break in Contentful and link all slots.
    await createBreaks(title, slug, cardImage, type, date, format, breakTags, slots, breakNumber);
}

generateBreaks();
