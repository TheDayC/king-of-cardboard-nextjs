import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ImageItem } from '../../types/products';
import Loading from '../Loading';
import selector from './selector';
import { get, split } from 'lodash';
import Images from './Images';
import Details from './Details';
import { fetchBreakBySlug } from '../../utils/breaks';
import { BreakSlot, ContentfulBreak } from '../../types/breaks';
import Slots from './Slots';

interface BreakProps {
    slug: string;
}

export const Break: React.FC<BreakProps> = ({ slug }) => {
    const { accessToken } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
    const [currentBreak, setCurrentBreak] = useState<ContentfulBreak | null>(null);

    const fetchBreakData = useCallback(async (token: string, productSlug: string) => {
        const breakData = await fetchBreakBySlug(productSlug);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (breakData) {
            setCurrentBreak(breakData);
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchBreakData(accessToken, slug);
        }
    }, [accessToken, slug]);

    // Set first image.
    useEffect(() => {
        if (currentBreak && currentBreak.imagesCollection) {
            setCurrentImage(currentBreak.imagesCollection.items[0]);
        }
    }, [currentBreak]);

    if (currentBreak) {
        const description = currentBreak.description ? split(currentBreak.description, '\n\n') : [];
        const slots: BreakSlot[] | null = get(currentBreak, 'breakSlotsCollection.items', null);

        return (
            <div className="p-4 lg:p-6 relative">
                <Loading show={loading} />
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row">
                        <Images mainImage={currentImage} imageCollection={get(currentBreak, 'images.items', null)} />

                        <div id="productDetails" className="flex flex-col items-center w-full lg:w-3/4">
                            <div className="card rounded-md shadow-lg bordered p-4 w-full lg:p-6">
                                <Details name={currentBreak.title} tags={currentBreak.tags} description={description} />
                                {slots && <Slots slots={slots} format={currentBreak.format} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Break;
