import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import {
    addStockStatus,
    removeAllCategories,
    removeAllConfigurations,
    removeAllInterests,
    removeAllStockStatuses,
} from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Category, Configuration, Interest, SortOption, StockStatus } from '../../enums/products';
import { Product } from '../../types/products';
import { listProducts } from '../../utils/account/products';
import { fetchProducts, setIsLoadingProducts, setProductsAndCount } from '../../store/slices/products';
import selector from './selector';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];
const STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];

export const getServerSideProps: GetServerSideProps = async () => {
    const { content } = await getPageBySlug('shop', '');

    const { products: baseballProducts, count: baseballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Baseball],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: basketballProducts, count: basketballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Basketball],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: footballProducts, count: footballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Football],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: soccerProducts, count: soccerCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Soccer],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: ufcProducts, count: ufcCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.UFC],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: wweProducts, count: wweCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Wrestling],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );
    const { products: pokemonProducts, count: pokemonCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Pokemon],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        true
    );

    return {
        props: {
            errorCode: null,
            content,
            baseballProducts,
            basketballProducts,
            footballProducts,
            soccerProducts,
            ufcProducts,
            wweProducts,
            pokemonProducts,
            allProducts: [
                ...baseballProducts,
                ...basketballProducts,
                ...footballProducts,
                ...soccerProducts,
                ...ufcProducts,
                ...wweProducts,
                ...pokemonProducts,
            ],
            totalCount:
                baseballCount + basketballCount + footballCount + soccerCount + ufcCount + wweCount + pokemonCount,
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
    const { shouldShowRows, searchTerm, sortOption } = useSelector(selector);
    const hasSearchTerm = searchTerm.length > 0;

    useEffect(() => {
        dispatch(setIsLoadingProducts(true));

        // Reset the shop.
        dispatch(removeAllCategories());
        dispatch(removeAllConfigurations());
        dispatch(removeAllInterests());
        dispatch(removeAllStockStatuses());

        // Add default stock statuses
        STOCK_STATUSES.forEach((status) => {
            dispatch(addStockStatus(status));
        });

        // Update the shop products.
        dispatch(
            setProductsAndCount({
                products: allProducts,
                count: totalCount,
            })
        );
    }, [dispatch, allProducts, totalCount]);

    // If the search term or sorty updates then fetch the products.
    useEffect(() => {
        dispatch(setIsLoadingProducts(true));
        dispatch(fetchProducts({ limit: 8, skip: 0 }));
    }, [dispatch, searchTerm, sortOption]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards products for the UK."
        >
            <div className="flex flex-col w-full relative">
                <div className="block w-full mb-10">{content && <Content content={[content]} />}</div>
                {shouldShowRows && !hasSearchTerm ? (
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
