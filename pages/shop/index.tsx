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
import { Product } from '../../types/productsNew';
import { listProducts } from '../../utils/account/products';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];

export const getServerSideProps: GetServerSideProps = async () => {
    const { content } = await getPageBySlug('shop', '');

    const { products: baseballProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.Baseball,
    ]);
    const { products: basketballProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.Basketball,
    ]);
    const { products: footballProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.Football,
    ]);
    const { products: soccerProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [Interest.Soccer]);
    const { products: ufcProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [Interest.UFC]);
    const { products: wweProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [Interest.Wrestling]);
    const { products: pokemonProducts } = await listProducts(LIMIT, SKIP, CATEGORIES, CONFIGURATIONS, [
        Interest.Pokemon,
    ]);

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
        },
    };
};

interface ShopProps {
    content: Document | null;
    baseballProducts: Product[];
    basketballProducts: Product[];
    footballProducts: Product[];
    soccerProducts: Product[];
    ufcProducts: Product[];
    wweProducts: Product[];
    pokemonProducts: Product[];
}

export const ShopPage: React.FC<ShopProps> = ({
    content,
    baseballProducts,
    basketballProducts,
    footballProducts,
    soccerProducts,
    ufcProducts,
    wweProducts,
    pokemonProducts,
}) => {
    const dispatch = useDispatch();
    const { shouldShowRows } = useSelector(selector);

    useEffect(() => {
        dispatch(removeAllCategories());
        dispatch(removeAllConfigurations());
        dispatch(removeAllInterests());
        dispatch(removeAllStockStatuses());
    }, [dispatch]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards products for the UK."
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={[content]} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters />
                    {shouldShowRows ? (
                        <LatestProductRows
                            baseballProducts={baseballProducts}
                            basketballProducts={basketballProducts}
                            footballProducts={footballProducts}
                            soccerProducts={soccerProducts}
                            ufcProducts={ufcProducts}
                            wrestlingProducts={wweProducts}
                            pokemonProducts={pokemonProducts}
                        />
                    ) : (
                        <Grid />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
