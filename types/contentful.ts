export interface ImageItem {
    title: string;
    description: string;
    url: string;
}

export interface ImageCollection {
    items: ImageItem[];
}

export interface ContentfulItem {
    metadata: any;
    sys: any;
    fields: any;
}
