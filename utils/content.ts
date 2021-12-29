import axios, { AxiosResponse } from 'axios';

import { errorHandler } from '../middleware/errors';

export const PRODUCT_QUERY = `
    query {
        productCollection {
            items {
                name
                description {
                    json
                }
                productLink
                types
                categories
                imageCollection {
                    items {
                        title
                        description
                        url
                    }
                }
            }
        }
    }
`;

export const PAGES_QUERY = `
    query {
        pagesCollection {
            items {
                title
                content {
                    json
                }
                sliderCollection {
                  items {
                    title
                    description
                    contentType
                    fileName
                    url
                    width
                    height
                  }
                }
                hero
            }
        }
    }
`;

export async function fetchContent(query: string): Promise<AxiosResponse<unknown> | void> {
    try {
        const response = await axios.post('/api/content/fetchContent', { query });

        return response;
    } catch (error: unknown) {
        errorHandler(error, 'We could not create an auth token, please refresh.');
    }
}
