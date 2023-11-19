import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';
import { isEqual } from 'lodash';
import { createSelector } from '@reduxjs/toolkit';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { resetFilters } from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Product } from '../../types/products';
import { listProductRows } from '../../utils/account/products';
import {
    fetchProductRows,
    fetchProducts,
    setIsLoadingProducts,
    setProductsAndCount,
} from '../../store/slices/products';
import { selectFiltersData } from '../../store/state/selectors';
import { DEFAULT_STOCK_STATUSES } from '../../utils/constants';
import { SortOption } from '../../enums/products';
import { SliderImage } from '../../types/pages';

const LIMIT = 4;
const SKIP = 0;

const selector = createSelector([selectFiltersData], (filters) => ({
    shouldShowRows:
        filters.categories.length === 0 &&
        filters.configurations.length === 0 &&
        filters.interests.length === 0 &&
        isEqual(filters.stockStatus, DEFAULT_STOCK_STATUSES),
    searchTerm: filters.searchTerm,
    sortOption: filters.sortOption,
    hasSearchTerm: filters.searchTerm.length > 0,
    hasNonDefaultSortOption: filters.sortOption !== SortOption.DateAddedDesc,
}));

export const getServerSideProps: GetServerSideProps = async () => {
    const { content, sliderImages } = await getPageBySlug('shop', '');

    const productFacets = await listProductRows(LIMIT, SKIP, true);

    return {
        props: {
            content,
            sliderImages,
            allProducts: [
                ...productFacets.baseball,
                ...productFacets.basketball,
                ...productFacets.football,
                ...productFacets.soccer,
                ...productFacets.ufc,
                ...productFacets.wrestling,
                ...productFacets.tcg,
                ...productFacets.other,
                ...productFacets.f1,
            ],
        },
    };
};

interface ShopProps {
    content: Document | null;
    allProducts: Product[];
    sliderImages: SliderImage[] | null;
}

export const ShopPage: React.FC<ShopProps> = ({ content, allProducts, sliderImages }) => {
    const dispatch = useDispatch();
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { shouldShowRows, sortOption, hasSearchTerm, hasNonDefaultSortOption, searchTerm } = useSelector(selector);
    const shouldFetchRows = shouldShowRows && !hasSearchTerm && !hasNonDefaultSortOption;

    // On page load set the server side fetched products
    useEffect(() => {
        if (!setIsInitialLoad) return;

        dispatch(setIsLoadingProducts(true));

        // Reset the filters for the shop to show a default state.
        dispatch(resetFilters());

        // Update the shop products.
        dispatch(
            setProductsAndCount({
                products: allProducts,
                count: 0,
            })
        );
        setIsInitialLoad(false);
    }, [dispatch, allProducts, isInitialLoad]);

    // If the search term is changed then fetch products.
    useEffect(() => {
        if (isInitialLoad) return;

        dispatch(setIsLoadingProducts(true));

        if (shouldFetchRows) {
            dispatch(fetchProductRows({ limit: 4, skip: 0 }));
        } else {
            dispatch(fetchProducts({ limit: 8, skip: 0 }));
        }
    }, [dispatch, shouldFetchRows, sortOption, searchTerm, isInitialLoad]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="Sealed sports cards boxes, individual cards, imports and pre-orders for UK collectors. Collect your favourite teams and players from the Premier League, NFL, NBA, UFC and WWE."
        >
            <div className="flex flex-col w-full relative space-y-4">
                {sliderImages && sliderImages.length && (
                    <div className="image-container">
                        <img
                            src={sliderImages[0].url}
                            title={sliderImages[0].title}
                            alt={sliderImages[0].description}
                        />
                    </div>
                )}
                <div className="block w-full">{content && <Content content={[content]} />}</div>
                {shouldFetchRows ? (
                    <div className="flex flex-col w-full relative space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <Filters />
                        <LatestProductRows />
                    </div>
                ) : (
                    <div className="flex flex-col w-full relative space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <Filters />
                        <Grid />
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
