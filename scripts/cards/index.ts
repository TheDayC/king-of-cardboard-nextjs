import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { mtgCards } from './data/mtg';
import { pokemonCards } from './data/pokemon';
import { soccerCards } from './data/soccer';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createSingles } from './create/singles';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'soccer,single',
};
const sku = '{{CODEANDNAME}}-SINGLE';

async function generateCards(): Promise<void> {
    // Create the teams for this break.
    const cards = await createAssets(sku, assetsOptions, soccerCards);

    if (!cards) return;

    // Create the skus based on the teams data in commerce layer.
    const skusWithIds = await createSkus(cards);

    if (skusWithIds.length < 0) return;

    // Create the single in Contentful and link products.
    await createSingles(cards, skusWithIds);
}

generateCards();
