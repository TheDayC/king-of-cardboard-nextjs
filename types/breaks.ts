import { Document } from '@contentful/rich-text-types';

import { SkuInventory } from './commerce';
import { ImageCollection, ImageItem } from './products';

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

export interface Break {
    cardImage: ImageItem;
    breakNumber: number;
    title: string;
    tags: string[];
    types: string;
    slug: string;
    slots: number;
    format: string;
    breakDate: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
}

export interface SingleBreak {
    id: string;
    title: string;
    slug: string;
    sku_code: string;
    description: Document[];
    types: string;
    images: ImageItem[];
    cardImage: ImageItem;
    breakSlots: BreakSlot[];
    breakDate: string;
    tags: string[];
    format: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
}

export interface BreaksWithCount {
    breaks: Break[];
    count: number;
    order: string;
}

export interface BreakSlotsCollection {
    items: ContentfulBreakSlot[];
}

export interface ContentfulBreakSlot {
    name: string;
    productLink: string;
    image: ImageItem;
}

export interface BreakSlot {
    id: string;
    name: string;
    image: ImageItem;
    sku_code: string;
    amount: string;
    compare_amount: string;
    isAvailable: boolean;
}

export interface BreakTypeItem {
    title: string;
    link: string;
}

export interface BreakStatuses {
    isLive: boolean;
    isComplete: boolean;
}
