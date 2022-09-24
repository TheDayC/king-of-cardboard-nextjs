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
import { Categories, ProductType } from '../../enums/shop';
import { Product } from '../../types/products';
import { getShallowImports } from '../../utils/imports';
import LatestImportRows from '../../components/Shop/LatestImportRows';
import { ShallowImport } from '../../types/imports';

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

    const baseballProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Baseball,
    ]);
    const basketballProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Basketball,
    ]);
    const footballProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [
        ProductType.Football,
    ]);
    const soccerProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [ProductType.Soccer]);
    const ufcProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [ProductType.UFC]);
    const wweProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [ProductType.Wrestling]);
    const pokemonProducts = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [ProductType.Pokemon]);

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

interface ImportPageProps {
    accessToken: CreateToken;
    content: Document[] | null;
    baseballProducts: ShallowImport[];
    basketballProducts: ShallowImport[];
    footballProducts: ShallowImport[];
    soccerProducts: ShallowImport[];
    ufcProducts: ShallowImport[];
    wweProducts: ShallowImport[];
    pokemonProducts: ShallowImport[];
}

export const ImportsPage: React.FC<ImportPageProps> = ({
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
            title="Imports - King of Cardboard"
            description="Imported sports cards at competitive market rates for the UK."
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={content} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters />
                    {shouldShowRows ? (
                        <LatestImportRows
                            baseballProducts={baseballProducts}
                            basketballProducts={basketballProducts}
                            footballProducts={footballProducts}
                            soccerProducts={soccerProducts}
                            ufcProducts={ufcProducts}
                            wweProducts={wweProducts}
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

export default ImportsPage;
