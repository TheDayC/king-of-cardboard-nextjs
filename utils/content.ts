import axios, { AxiosResponse } from 'axios';

import { AxiosData } from '../types/fetch';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchContent(query: string): Promise<AxiosResponse<AxiosData> | void> {
    try {
        const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.REACT_APP_SPACE_ID}/environments/master`;

        return await axios.get(url, {
            method: 'GET',
            params: {
                query,
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.REACT_APP_TOKEN}`,
            },
        });
    } catch (e) {
        console.error(e);
    }
}
