import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { nbaTeams } from './basketballData';
import { createTeams } from '../createTeams';
import { createSkus } from './create';
import { createBreakSlots } from '../createBreakSlots';
import { createBreaks } from '../createBreaks';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'nba,logos',
};
const sku = 'HOOPS-HOBBY-NBA-{{CODE}}-SLOT';
const name = 'Hoops 21/22 Hobby - {{TEAM}}';
const title = 'Hoops 21/22 Hobby - Break 2';
const slug = 'hoops-21-22-hobby-break-2';
const cardImage = '3AFpug51mi25CPaTX8rTh9';
const type = 'basketball';
const date = '2022-02-22T19:00:00';
const format = 'Pick Your Team';
const tags = ['Entry'];

async function createBasketballBreak(): Promise<void> {
    // Create the teams for this break.
    const teams = await createTeams(sku, name, assetsOptions, nbaTeams);

    if (!teams) return;

    // Create the skus based on the teams data in commerce layer.
    const hasCreatedSkus = await createSkus(teams);

    if (!hasCreatedSkus) return;

    // Create the slots in Contentful
    const slots = await createBreakSlots(teams, ['nba', 'break', 'basketball', 'hoopsHobby']);

    if (slots.length <= 0) return;

    // Create the break in Contentful and link all slots.
    await createBreaks(title, slug, cardImage, type, date, format, tags, slots);
}

createBasketballBreak();
