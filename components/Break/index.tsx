import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { split } from 'lodash';

import Loading from '../Loading';
import selector from './selector';
import Images from './Images';
import Details from './Details';
import Slots from './Slots';
import { fetchSingleBreak } from '../../store/slices/breaks';
import Legend from './Legend';

interface BreakProps {
    slug: string;
}

export const Break: React.FC<BreakProps> = ({ slug }) => {
    const { accessToken, currentBreak } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const dispatch = useDispatch();
    const { title, cardImage, images, tags, description } = currentBreak;
    const splitDesc = description ? split(currentBreak.description, '\n\n') : [];

    useEffect(() => {
        if (accessToken && shouldFetch && slug) {
            setShouldFetch(false);
            setLoading(true);
            dispatch(fetchSingleBreak({ accessToken, slug }));
            setLoading(false);
        }
    }, [accessToken, slug, dispatch, shouldFetch]);

    return (
        <div className="flex flex-col lg:flex-row relative">
            <Loading show={loading} />
            <div className="flex flex-col w-1/3">
                <Images mainImage={cardImage} images={images} />
                <Legend />
            </div>
            <div id="productDetails" className="flex flex-col items-center w-full lg:w-3/4">
                <div className="card rounded-md shadow-lg bordered p-4 w-full lg:p-6">
                    <Details name={title} tags={tags} description={splitDesc} />
                    <Slots />
                </div>
            </div>
        </div>
    );
};

export default Break;
