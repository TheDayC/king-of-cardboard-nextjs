import { ImageItem } from './contentful';

export interface PriceHistory {
    timestamp: string;
    amount: string;
}

export interface ShallowImport {
    name: string;
    image: ImageItem;
    tags: string[];
    amount: string;
    compareAmount: string;
    slug: string;
    priceHistory: PriceHistory[];
}

export interface ImportsWithCount {
    imports: ShallowImport[];
    count: number;
}
