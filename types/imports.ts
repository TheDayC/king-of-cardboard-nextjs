import { SkuInventory } from './commerce';
import { ImageCollection, ImageItem } from './contentful';
import { SavedSkuOptions } from './products';

export interface Import {
    id: string;
    name: string;
    slug: string;
    sku_code: string;
    description: Document[] | null;
    types: string[];
    categories: string[];
    images: ImageItem[];
    cardImage: ImageItem;
    tags: string[];
    amount: string;
    compare_amount: string;
}

export interface ShallowImport {
    name: string;
    image: ImageItem;
    tags: string[];
    amount: string;
    compareAmount: string;
    slug: string;
}

export interface ImportsWithCount {
    imports: ShallowImport[];
    count: number;
}

export interface SingleImport {
    id: string;
    name: string;
    slug: string;
    sku_code: string;
    description: Document[] | null;
    types: string[];
    categories: string[];
    images: ImageCollection;
    cardImage: ImageItem;
    tags: string[];
    amount: string;
    compare_amount: string;
    inventory: SkuInventory;
    skuOptions: SavedSkuOptions[];
}
