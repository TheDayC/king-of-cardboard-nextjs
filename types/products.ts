import { Categories, ProductType } from '../enums/shop';
export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    stock: number;
    description: DescriptionContent[];
    types: ProductType[] | null;
    categories: Categories[] | null;
    images: Image[];
}

export interface ContentfulProduct {
    name: string;
    productLink: string;
    description: Description;
    types: string[];
    categories: string[];
    imageCollection: ImageCollection;
}

interface ImageCollection {
    items: Image[];
}

interface Description {
    json: DescriptionJSON;
}

interface DescriptionJSON {
    nodeType: string;
    content: DescriptionContent[];
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface DescriptionContent {
    nodeType: string;
    value: string;
    marks: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Image {
    title: string;
    description: string;
    url: string;
}
