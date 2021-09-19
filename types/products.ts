export interface ContentfulProduct {
    name: string;
    productLink: string;
    description: Description;
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
