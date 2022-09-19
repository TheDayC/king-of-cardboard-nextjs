import { Document } from '@contentful/rich-text-types';

export interface ContentfulPage {
    title: string;
    content: Document;
    sliderCollection: SliderCollection;
    hero: Hero[];
}

// Type the slider collection fields.
interface SliderCollection {
    items: SliderImage[];
}

export interface SliderImage {
    title: string;
    description: string;
    contentType: string;
    fileName: string;
    url: string;
    width: number;
    height: number;
}

export interface Hero {
    title: string;
    content: string[];
    type: string;
    image_url?: string;
    link?: string;
    link_title?: string;
}

export interface ServerSideRedirectProps {
    redirect: {
        permanent: boolean;
        destination: string;
    };
}

export interface PageWithHero {
    content: Document[] | null;
    heroes: Hero[] | null;
    sliderImages: SliderImage[];
}
