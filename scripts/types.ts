export interface Team {
    code: string;
    name: string;
    amount: string;
    image_id: string;
    image_url: string;
    sku?: string;
}

export interface Teams {
    [team: string]: Team;
}

export interface Card {
    code: string;
    sku: string;
    name: string;
    title: string;
    amount: string;
    quantity: number;
    image_id: string;
    image_url: string;
    set: string;
    types: string[];
    categories: string[];
    tags: string[];
}

export interface Cards {
    [card: string]: Card;
}

export interface Break {
    code: string;
    sku: string;
    name: string;
    title: string;
    amount: string;
    quantity: number;
    image_id: string;
    image_url: string;
    set: string;
    types: string[];
    categories: string[];
    tags: string[];
}

export interface Breaks {
    [x: string]: Break;
}

export interface SkusWithIds {
    code: string;
    id: string;
}
