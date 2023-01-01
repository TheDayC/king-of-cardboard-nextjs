/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';
import imageType from 'image-type';

import { AttachmentData } from '../types/webhooks';

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
