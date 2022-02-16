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
import { scoreTeams } from './data/epl-score';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createBreaks } from './create/breaks';
import { createBreakSlots } from './create/slots';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'epl,logos',
};

const breakNumber = 11;
const sku = `BREAK-${breakNumber}-{{CODEANDNAME}}`;
const title = 'Score Fat Pack Box 21/22';
const slug = 'score-fat-pack-box-21-22';
const cardImage = '7EUoxoEKyVxBt5VeuQ0y3I';
const type = 'soccer';
const date = '2022-02-20T19:00:00';
const format = 'Pick Your Team';
const breakTags = ['Entry', 'High Yield'];
const slotTags = ['soccer', 'epl', 'slot'];
const isRandom = false;

async function generateBreaks(): Promise<void> {
    // Create the teams for this break.
    const teams = await createAssets(sku, assetsOptions, scoreTeams, breakNumber, isRandom);

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
