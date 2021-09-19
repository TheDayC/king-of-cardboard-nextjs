import { ContentfulProduct } from './products';

export interface AxiosData {
    data: Data;
}

interface Data {
    productCollection?: ProductCollection;
}

interface ProductCollection {
    items: ContentfulProduct[];
}
