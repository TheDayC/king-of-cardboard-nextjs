import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { mtgCards } from './data/mtg';
import { pokemonCards } from './data/pokemon';
import { soccerCards } from './data/soccer';
import { footballCards } from './data/football';
import { basketballCards } from './data/basketball';
import { mixedCards } from './data/mixed';
import { createAssets } from './create/assets';
import { createSkus } from './create/skus';
import { createSingles } from './create/singles';

const assetsOptions = {
    limit: 30,
    'metadata.tags.sys.id[all]': 'single',
};
const sku = '{{CODEANDNAME}}-SINGLE';

async function generateCards(): Promise<void> {
    // Create the teams for this break.
    const cards = await createAssets(sku, assetsOptions, mixedCards);

    if (!cards) return;

    // Create the skus based on the teams data in commerce layer.
    const skusWithIds = await createSkus(cards);

    if (skusWithIds.length < 0) return;

    // Create the single in Contentful and link products.
    await createSingles(cards, skusWithIds);
}

generateCards();
