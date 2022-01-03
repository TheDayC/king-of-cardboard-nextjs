import { SkuInventory, SkuOption } from './commerce';
import { ImageCollection, ImageItem } from './products';

export interface ContentfulBreaksResponse {
    total: number;
    breaksCollection: ContentfulBreak[] | null;
}

export interface ContentfulBreak {
    title: string;
    slug: string;
    description: string;
    cardImage: ImageItem;
    imagesCollection: ImageCollection;
    types: string;
    breakSlotsCollection: BreakSlotsCollection;
    breakDate: string;
    tags: string[];
    format: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
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
    sku_code: string;
    description: string;
    types: string;
    images: ImageItem[];
    cardImage: ImageItem;
    amount: string;
    compare_amount: string;
    inventory: SkuInventory;
    breakSlots: BreakSlot[];
    breakDate: string;
    tags: string[];
    format: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
}

export interface BreakSlotsCollection {
    items: ContentfulBreakSlot[];
}

export interface ContentfulBreakSlot {
    name: string;
    productLink: string;
    slotIdentifier: string;
    image: ImageItem;
}

export interface BreakSlot {
    id: string;
    name: string;
    image: ImageItem;
    sku_code: string;
    amount: string;
    compare_amount: string;
}

export interface BreakTypeItem {
    title: string;
    link: string;
}
