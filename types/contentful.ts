export interface ImageItem {
    title: string;
    description: string;
    url: string;
}

export interface ImageCollection {
    items: ImageItem[];
}

export interface Repeater {
    id: string;
    key: string;
    value: string;
}
