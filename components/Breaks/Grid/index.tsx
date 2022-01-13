import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import Pagination from '../../Pagination';
import { fetchBreaks, fetchBreaksTotal, setIsLoadingBreaks } from '../../../store/slices/breaks';
import BreakCard from './BreakCard';
import selector from './selector';

const PER_PAGE = 9;

export const Grid: React.FC = () => {
    const { accessToken, breaks, breaksTotal } = useSelector(selector);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [shouldFetch, setShouldFetch] = useState(true);

    const productPageCount = ceil(divide(breaksTotal, PER_PAGE));

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            if (accessToken) {
                dispatch(setIsLoadingBreaks(true));
                setCurrentPage(pageNumber);
                dispatch(fetchBreaks({ accessToken, limit: pageNumber, skip: PER_PAGE }));
                dispatch(setIsLoadingBreaks(false));
            }
        },
        [accessToken, dispatch]
    );

    // Fetch all breaks on page load.
    useEffect(() => {
        if (shouldFetch && accessToken) {
            setShouldFetch(false);
            dispatch(fetchBreaks({ accessToken, limit: currentPage, skip: 0 }));
            dispatch(fetchBreaksTotal());
        }
    }, [dispatch, accessToken, currentPage, shouldFetch]);

    return (
        <div className="flex flex-col w-full">
            <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
                {breaks.map((b) => (
                    <BreakCard
                        cardImage={b.cardImage}
                        breakNumber={b.breakNumber}
                        title={b.title}
                        tags={b.tags}
                        breakType={b.types}
                        breakSlug={b.slug}
                        slots={b.slots}
                        format={b.format}
                        breakDate={b.breakDate}
                        isLive={b.isLive}
                        isComplete={b.isComplete}
                        vodLink={b.vodLink}
                        key={b.title}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {productPageCount > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        pageCount={productPageCount}
                        handlePageNumber={handlePageNumber}
                    />
                )}
            </div>
        </div>
    );
};

export default Grid;
