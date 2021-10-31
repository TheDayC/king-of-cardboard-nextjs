import { SkuInventory, SkuOption } from './commerce';
import { ImageCollection, ImageItem } from './products';

export interface ContentfulBreaksResponse {
    total: number;
    breaksCollection: ContentfulBreak[] | null;
}

export interface ContentfulBreak {
    title: string;
    slug: string;
    description: string | null;
    cardImage: ImageItem;
    imagesCollection: ImageCollection;
    types: string;
    breakSlotsCollection: BreakSlotsCollection | null;
    breakDate: string;
    tags: string[];
    format: string;
    isLive: boolean;
    isComplete: boolean;
}

export interface ContentfulBreakTypes {
    title: string;
    link: string;
}

export interface Break {
    id: string;
    title: string;
    slug: string;
    sku_code: string | null;
    description: string | null;
    types: string | null;
    cardImage: ImageItem | null;
    imagesCollection: ImageCollection | null;
    tags: string[] | null;
}

export interface SingleBreak {
    id: string;
    title: string;
    slug: string;
    sku_code: string | null;
    description: string | null;
    types: string | null;
    images: ImageCollection | null;
    cardImage: ImageItem | null;
    tags: string[] | null;
    amount: string | null;
    compare_amount: string | null;
    inventory: SkuInventory | null;
    options: SkuOption[] | null;
}

export interface BreakSlotsCollection {
    items: BreakSlot[];
}

export interface BreakSlot {
    name: string;
    productLink: string;
    slotIdentifier: string;
    image: ImageItem | null;
}
