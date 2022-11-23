/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LineItem } from '@commercelayer/sdk';
import axios from 'axios';
import imageType from 'image-type';

import { AttachmentData } from '../types/webhooks';
import { parseAsString, safelyParse } from './parsers';

export async function parseImgData(id: string, url: string): Promise<AttachmentData> {
    const res = await axios.get(url, { responseType: 'arraybuffer' });

    // @ts-ignore
    const content = Buffer.from(res.data, 'binary').toString('base64');

    // @ts-ignore
    const imgType = await imageType(res.data);
    const mime = imgType ? imgType.mime : 'image/png';
    const ext = imgType ? imgType.ext : 'png';

    return {
        type: mime,
        filename: `${id}.${ext}`,
        content,
        content_id: id,
        disposition: 'inline',
    };
}

export function getLineItems(included: unknown[]): LineItem[] {
    const lineItems = included.filter((item: unknown): item is LineItem => {
        const type = safelyParse(item, 'type', parseAsString, '');
        const sku = safelyParse(item, 'attributes.sku_code', parseAsString, null);

        return Boolean(type === 'line_items' && sku);
    });

    return lineItems;
}
