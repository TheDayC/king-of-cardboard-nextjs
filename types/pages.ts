import { Document } from '@contentful/rich-text-types';

export interface ContentfulPage {
    title: string;
    content: Document;
    sliderCollection: SliderCollection;
    hero: Hero[];
}

export interface Marks {
    [x: string]: string;
}

// Type the slider collection fields.
interface SliderCollection {
    items: SliderImage[];
}

interface SliderImage {
    title: string;
    description: string;
    contentType: string;
    fileName: string;
    url: string;
    width: number;
    height: number;
}

interface Hero {
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

export interface Page {
    title: string;
    content: Document[] | null;
}
