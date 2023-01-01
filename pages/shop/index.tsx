import React, { useEffect } from 'react';
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
import { listProducts } from '../../utils/account/products';
import {
    fetchProductRows,
    fetchProducts,
    setIsLoadingProducts,
    setProductsAndCount,
} from '../../store/slices/products';
import selector from './selector';
import { DEFAULT_STOCK_STATUSES, PRODUCT_INTERESTS } from '../../utils/constants';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];

export const getServerSideProps: GetServerSideProps = async () => {
    const { content } = await getPageBySlug('shop', '');

    let allProducts: Product[] = [];
    let totalCount = 0;

    for (const interest of PRODUCT_INTERESTS) {
        const { products: tempProducts, count: tempCount } = await listProducts(
            LIMIT,
            SKIP,
            true,
            CATEGORIES,
            CONFIGURATIONS,
            [interest],
            DEFAULT_STOCK_STATUSES,
            '',
            SortOption.DateAddedDesc
        );

        allProducts = [...allProducts, ...tempProducts];
        totalCount = totalCount + tempCount;
    }

    return {
        props: {
            content,
            allProducts,
            totalCount,
        },
    };
};

interface ShopProps {
    content: Document | null;
    allProducts: Product[];
    totalCount: number;
}

export const ShopPage: React.FC<ShopProps> = ({ content, allProducts, totalCount }) => {
    const dispatch = useDispatch();
    const { shouldShowRows, searchTerm, sortOption, hasSearchTerm } = useSelector(selector);
    const shouldFetchRows = shouldShowRows && !hasSearchTerm;

    useEffect(() => {
        dispatch(setIsLoadingProducts(true));

        // Reset the shop.
        dispatch(resetFilters());

        // Update the shop products.
        dispatch(
            setProductsAndCount({
                products: allProducts,
                count: totalCount,
            })
        );
    }, [dispatch, allProducts, totalCount]);

    const debouncedFetchProductRows = debounce(async () => {
        dispatch(fetchProductRows({ limit: 4, skip: 0 }));
    }, 700);

    const debouncedFetchProducts = debounce(async () => {
        dispatch(fetchProducts({ limit: 8, skip: 0 }));
    }, 700);

    // If the search term or sorty updates then fetch the products.
    /* useEffect(() => {
        dispatch(setIsLoadingProducts(true));

        if (shouldShowRows) {
            debouncedFetchProductRows();
        } else {
            debouncedFetchProducts();
        }
    }, [dispatch, searchTerm, sortOption, shouldShowRows]);
    
    useEffect(() => {
        dispatch(setIsLoadingProducts(true));

        if (shouldShowRows) {
            debouncedFetchProductRows();
        } else {
            debouncedFetchProducts();
        }
    }, [dispatch, sortOption, shouldShowRows]);
    
    useEffect(() => {
        dispatch(setIsLoadingProducts(true));

        if (shouldFetchRows) {
            debouncedFetchProductRows();
        } else {
            debouncedFetchProducts();
        }
    }, [dispatch, searchTerm, shouldFetchRows]); */

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
