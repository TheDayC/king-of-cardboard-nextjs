import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { nbaTeams } from './data/nba';
import { nflTeams } from './data/nfl';
import { eslTeams } from './data/esl';
import { uefaMerlinTeams } from './data/uefa-merlin';
import { uefaStadiumTeams } from './data/uefa-stadium';
import { worldCupTeams } from './data/world-cup';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createBreaks } from './create/breaks';
import { createBreakSlots } from './create/slots';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'international,soccer,logos',
};

const breakNumber = 8;
const sku = `BREAK-${breakNumber}-{{CODEANDNAME}}`;
const title = 'Donruss Soccer 21/22 Hobby';
const slug = 'donruss-soccer-21-22-hobby';
const cardImage = '3cw0LPqBFx5gnLfKxGmofA';
const type = 'soccer';
const date = '2022-03-19T19:00:00';
const format = 'Pick Your Team';
const breakTags = ['High End', 'High Yield'];
const slotTags = ['international', 'slot'];

async function generateBreaks(): Promise<void> {
    // Create the teams for this break.
    const teams = await createAssets(sku, assetsOptions, worldCupTeams);

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
