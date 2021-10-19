export interface ContentfulPage {
    title: string;
    content: ContentJSON;
    sliderCollection: SliderCollection;
}

// Setup the page content shape. Should be similar to any rich text field.
interface Content {
    json: ContentJSON[];
}

interface ContentJSON {
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

// Setup the slider collection fields.
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
