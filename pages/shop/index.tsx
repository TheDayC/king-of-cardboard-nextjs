import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllCategories, removeAllProductTypes } from '../../store/slices/filters';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { CreateToken } from '../../types/commerce';
import { createToken } from '../../utils/auth';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import selector from './selector';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Categories, FilterMode, ProductType } from '../../enums/shop';
import { getShallowProducts } from '../../utils/products';
import { Product, ShallowProduct } from '../../types/products';

const LIMIT = 4;
const SKIP = 0;
const CATEGORIES: Categories[] = [];
const DEFAULT_PRODUCTS: Product[] = [];

export const getServerSideProps: GetServerSideProps = async () => {
    const accessToken = await createToken();
    const content = await pageBySlug('shop', '');

    if (!accessToken.token) {
        return {
            props: {
                errorCode: !accessToken.token ? 500 : null,
                accessToken,
                content,
                basketballProducts: DEFAULT_PRODUCTS,
                footballProducts: DEFAULT_PRODUCTS,
                soccerProducts: DEFAULT_PRODUCTS,
                ufcProducts: DEFAULT_PRODUCTS,
                wweProducts: DEFAULT_PRODUCTS,
                pokemonProducts: DEFAULT_PRODUCTS,
            },
        };
    }

    const { products: baseballProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Baseball,
    ]);
    const { products: basketballProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Basketball,
    ]);
    const { products: footballProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Football,
    ]);
    const { products: soccerProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Soccer,
    ]);
    const { products: ufcProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.UFC,
    ]);
    const { products: wweProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Wrestling,
    ]);
    const { products: pokemonProducts } = await getShallowProducts(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Pokemon,
    ]);

    return {
        props: {
            errorCode: null,
            accessToken,
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
    accessToken: CreateToken;
    content: Document[] | null;
    baseballProducts: ShallowProduct[];
    basketballProducts: ShallowProduct[];
    footballProducts: ShallowProduct[];
    soccerProducts: ShallowProduct[];
    ufcProducts: ShallowProduct[];
    wweProducts: ShallowProduct[];
    pokemonProducts: ShallowProduct[];
}

export const ShopPage: React.FC<ShopProps> = ({
    accessToken,
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
        dispatch(removeAllProductTypes());
        dispatch(removeAllCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards products for the UK."
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={content} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters mode={FilterMode.Products} />
                    {shouldShowRows ? (
                        <LatestProductRows
                            baseballProducts={baseballProducts}
                            basketballProducts={basketballProducts}
                            footballProducts={footballProducts}
                            soccerProducts={soccerProducts}
                            ufcProducts={ufcProducts}
                            wweProducts={wweProducts}
                            pokemonProducts={pokemonProducts}
                        />
                    ) : (
                        <Grid mode={FilterMode.Products} />
                    )}
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
