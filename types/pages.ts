export interface ContentfulPage {
    title: string;
    content: ContentJSON;
    sliderCollection: SliderCollection;
    hero: Hero[];
}

export interface ContentJSON {
    nodeType: string;
    content: Content[];
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface Content {
    nodeType: string;
    value: string;
    marks: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
    data: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
