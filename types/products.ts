export interface Product {
    name: string;
    slug: string;
    sku_code: string | null;
    description: Description | null;
    types: string[];
    categories: string[];
    images: ImageCollection | null;
    cardImage: Image | null;
    tags: string[] | null;
    amount: string;
    compare_amount: string;
}

export interface ContentfulProduct {
    name: string;
    slug: string;
    productLink: string;
    description: Description | null;
    types: string[];
    categories: string[];
    imageCollection: ImageCollection;
    cardImage: Image;
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
