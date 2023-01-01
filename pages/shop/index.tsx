import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';
import { debounce } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { resetFilters } from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Category, Configuration, SortOption, StockStatus } from '../../enums/products';
import { Product } from '../../types/products';
import { listProductRows, listProducts } from '../../utils/account/products';
import {
    fetchProductRows,
    fetchProducts,
    setIsLoadingProducts,
    setProductsAndCount,
} from '../../store/slices/products';
import selector from './selector';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];

export const getServerSideProps: GetServerSideProps = async () => {
    const { content } = await getPageBySlug('shop', '');

    const productFacets = await listProductRows(LIMIT, SKIP, true);

    return {
        props: {
            content,
            allProducts: [
                ...productFacets.baseball,
                ...productFacets.basketball,
                ...productFacets.football,
                ...productFacets.soccer,
                ...productFacets.ufc,
                ...productFacets.wrestling,
                ...productFacets.pokemon,
                ...productFacets.other,
            ],
        },
    };
};

interface ShopProps {
    content: Document | null;
    allProducts: Product[];
}

export const ShopPage: React.FC<ShopProps> = ({ content, allProducts }) => {
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
    }, [dispatch, allProducts]);

    // If the search term is changed then fetch products.
    useEffect(() => {
        if (isInitialLoad) return;

        dispatch(setIsLoadingProducts(true));

        if (shouldFetchRows) {
            dispatch(fetchProductRows({ limit: 4, skip: 0 }));
        } else {
            dispatch(fetchProducts({ limit: 8, skip: 0 }));
        }
    }, [dispatch, shouldFetchRows, sortOption, searchTerm]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards products for the UK."
        >
            <div className="flex flex-col w-full relative">
                <div className="block w-full mb-10">{content && <Content content={[content]} />}</div>
                {shouldFetchRows ? (
                    <div className="flex flex-col w-full relative md:flex-row">
                        <Filters />
                        <LatestProductRows />
                    </div>
                ) : (
                    <div className="flex flex-col w-full relative md:flex-row">
                        <Filters />
                        <Grid />
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
