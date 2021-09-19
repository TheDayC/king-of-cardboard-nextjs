import { Categories, ProductType } from '../enums/shop';
export interface Product {
    id: string;
    name: string;
    price: number | null;
    stock: number | null;
    description: DescriptionContent[];
    types: ProductType[] | null;
    categories: Categories[] | null;
}

export interface ContentfulProduct {
    name: string;
    productLink: string;
    description: Description;
    types: string[];
    categories: string[];
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
