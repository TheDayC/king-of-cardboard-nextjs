import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';
import Images from './Images';
import Details from './Details';
import Slots from './Slots';
import { fetchSingleBreak, setIsLoadingBreak } from '../../store/slices/breaks';
import Legend from './Legend';
import Skeleton from './Skeleton';
import Content from '../Content';

interface BreakProps {
    slug: string;
}

export const Break: React.FC<BreakProps> = ({ slug }) => {
    const { accessToken, currentBreak, isLoadingBreak } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();
    const { title, cardImage, images, tags, description } = currentBreak;

    useEffect(() => {
        if (accessToken && shouldFetch && slug) {
            setShouldFetch(false);
            dispatch(setIsLoadingBreak(true));
            dispatch(fetchSingleBreak({ accessToken, slug }));
        }
    }, [accessToken, slug, dispatch, shouldFetch]);

    if (isLoadingBreak) {
        return <Skeleton />;
    } else {
        return (
            <div className="flex flex-col lg:flex-row relative">
                <div className="flex flex-col w-full lg:w-1/3">
                    <Images mainImage={cardImage} images={images} />
                    <Legend />
                </div>
                <div id="productDetails" className="flex flex-col items-center w-full lg:w-3/4">
                    <div className="card rounded-md shadow-lg bordered p-4 w-full lg:p-6">
                        <Details name={title} tags={tags} />
                        {description && <Content content={description} />}
                        <Slots />
                    </div>
                </div>
            </div>
        );
    }
};

export default Break;
