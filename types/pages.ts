import { Document } from '@contentful/rich-text-types';

export interface ContentfulPage {
    title: string;
    slug: string;
    content: Document | null;
    sliderImages: SliderImage[] | null;
    hero: Hero[];
}

export interface SliderImage {
    title: string;
    description: string;
    contentType: string;
    fileName: string;
    url: string;
}

export interface Hero {
    title: string;
    content: string[];
    type: string;
    image_url?: string;
    link?: string;
    link_title?: string;
}

export interface PageWithHero {
    content: Document[] | null;
    heroes: Hero[] | null;
    sliderImages: SliderImage[];
}
