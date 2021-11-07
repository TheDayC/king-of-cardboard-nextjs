import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide, get } from 'lodash';
import { useRouter } from 'next/router';

import selector from './selector';
import { fetchContentfulBreaks } from '../../../utils/breaks';
import Pagination from '../../Pagination';
import { setIsLoadingProducts } from '../../../store/slices/shop';
import { BreakSlot, ContentfulBreak } from '../../../types/breaks';
import { setIsLoadingBreaks } from '../../../store/slices/breaks';
import BreakCard from './BreakCard';

const PER_PAGE = 9;

export const Grid: React.FC = () => {
    const { accessToken, filters } = useSelector(selector);
    const dispatch = useDispatch();
    const [breaks, setBreaks] = useState<ContentfulBreak[] | null>(null);
    const [totalBreaks, setTotalBreaks] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const router = useRouter();
    const cat: string = get(router, 'query.cat', '');

    const productPageCount = ceil(divide(totalBreaks, PER_PAGE));

    const createBreakCollection = useCallback(
        async (accessToken: string, currentPage: number, productTypes: string) => {
            // First, find our contentful products with links.
            // Use Limit for max products per request.
            // Multiply the currentPage (needs to start at 0) by the limit to skip over the same amount of products each time.
            const { total, breaksCollection } = await fetchContentfulBreaks(
                PER_PAGE,
                currentPage * PER_PAGE,
                productTypes
            );

            // If we find products then move on to fetching by SKU in commerce layer.
            if (breaksCollection) {
                setBreaks(breaksCollection);
                dispatch(setIsLoadingBreaks(false));
            }

            // Set the total number of products for pagination.
            setTotalBreaks(total);
        },
        [dispatch]
    );

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            dispatch(setIsLoadingProducts(true));
            setCurrentPage(pageNumber);

            if (accessToken) {
                createBreakCollection(accessToken, pageNumber, cat);
            }
        },
        [accessToken, filters.productTypes]
    );

    // Create the product collection on load.
    useEffect(() => {
        if (!breaks && accessToken) {
            createBreakCollection(accessToken, 0, cat);
        }
    }, [breaks, accessToken, cat]);

    // Filter the collection.
    useEffect(() => {
        if (accessToken) {
            createBreakCollection(accessToken, 0, cat);
        }
    }, [accessToken, cat]);

    return (
        <div className="flex w-full p-4">
            <div className="container mx-auto">
                <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl2:grid-cols-4 gap-4">
                    {breaks &&
                        breaks.map((b) => {
                            const breakSlots: BreakSlot[] | null = get(b, 'breakSlotsCollection.items', null);
                            const sku_codes = breakSlots
                                ? breakSlots.filter((bS) => bS).map((bS) => bS.productLink)
                                : [];

                            return (
                                <BreakCard
                                    cardImage={b.cardImage}
                                    title={b.title}
                                    tags={b.tags}
                                    breakType={b.types}
                                    breakSlug={b.slug}
                                    slotSkus={sku_codes}
                                    format={b.format}
                                    breakDate={b.breakDate}
                                    isLive={b.isLive}
                                    isComplete={b.isComplete}
                                    vodLink={b.vodLink}
                                    key={b.title}
                                />
                            );
                        })}
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
        </div>
    );
};

export default Grid;