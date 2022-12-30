import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import {
    removeAllCategories,
    removeAllConfigurations,
    removeAllInterests,
    removeAllStockStatuses,
} from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import selector from './selector';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Category, Configuration, Interest } from '../../enums/products';
import { Product } from '../../types/products';
import { listProducts } from '../../utils/account/products';
import { setProductsAndCount } from '../../store/slices/products';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];

export const getServerSideProps: GetServerSideProps = async () => {
    const { content } = await getPageBySlug('shop', '');

    const { products: baseballProducts, count: baseballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Baseball]
    );
    const { products: basketballProducts, count: basketballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Basketball]
    );
    const { products: footballProducts, count: footballCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Football]
    );
    const { products: soccerProducts, count: soccerCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Soccer]
    );
    const { products: ufcProducts, count: ufcCount } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.UFC,
    ]);
    const { products: wweProducts, count: wweCount } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.Wrestling,
    ]);
    const { products: pokemonProducts, count: pokemonCount } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        [Interest.Pokemon]
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
    const { shouldShowRows } = useSelector(selector);

    useEffect(() => {
        dispatch(removeAllCategories());
        dispatch(removeAllConfigurations());
        dispatch(removeAllInterests());
        dispatch(removeAllStockStatuses());
        dispatch(
            setProductsAndCount({
                products: allProducts,
                count: totalCount,
            })
        );
    }, [dispatch, allProducts, totalCount]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards products for the UK."
        >
            <div className="flex flex-col w-full relative">
                <div className="block w-full mb-10">{content && <Content content={[content]} />}</div>
                {shouldShowRows ? (
                    <LatestProductRows />
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
