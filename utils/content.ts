import axios, { AxiosResponse } from 'axios';

import { AxiosData } from '../types/fetch';

export async function fetchContent(query: string): Promise<AxiosResponse<AxiosData> | void> {
    try {
        const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/master`;

        return await axios.get(url, {
            params: {
                query,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN}`,
            },
        });
    } catch (e) {
        console.error(e);
    }
}
