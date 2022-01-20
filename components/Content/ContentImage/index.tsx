import React, { useCallback, useEffect, useState } from 'react';

import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import { getAssetById } from '../../../utils/content';

interface ImageProps {
    assetId: string;
}

export const ContentImage: React.FC<ImageProps> = ({ assetId }) => {
    const [url, setUrl] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const fetchAsset = useCallback(async () => {
        const asset = await getAssetById(assetId);

        setUrl(safelyParse(asset, 'data.asset.fields.file.url', parseAsString, null));
        setWidth(safelyParse(asset, 'data.asset.fields.file.details.image.width', parseAsNumber, 0));
        setHeight(safelyParse(asset, 'data.asset.fields.file.details.image.height', parseAsNumber, 0));
        setTitle(safelyParse(asset, 'data.asset.fields.title', parseAsString, ''));
        setDescription(safelyParse(asset, 'data.asset.fields.description', parseAsString, ''));
    }, [assetId]);

    useEffect(() => {
        if (assetId) {
            fetchAsset();
        }
    }, [assetId, fetchAsset]);

    if (!url) return null;

    return <img src={`https://${url}`} alt={description} title={title} width={width} height={height} />;
};

export default ContentImage;
