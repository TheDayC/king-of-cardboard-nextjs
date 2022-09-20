import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsProductType, safelyParse } from '../../utils/parsers';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { Categories, ProductType } from '../../enums/shop';
import { getProducts } from '../../utils/products';
import { Product } from '../../types/products';
import { setIsLoadingProducts, setProductsAndCount } from '../../store/slices/products';

const LIMIT = 8;
const SKIP = 0;
const CATEGORIES: Categories[] = [];
const DEFAULT_PRODUCTS: Product[] = [];

export const getServerSideProps: GetServerSideProps = async (context) => {
    const accessToken = await createToken();

    if (!accessToken.token) {
        return {
            props: {
                errorCode: 500,
                shopType: null,
                accessToken,
                content: null,
                products: DEFAULT_PRODUCTS,
                count: 0,
            },
        };
    }

    const shopType = safelyParse(context, 'query.type', parseAsProductType, null);
    const content = await pageBySlug(shopType, 'shop/');
    const { products, count } = await getProducts(
        accessToken.token,
        LIMIT,
        SKIP,
        CATEGORIES,
        shopType ? [shopType] : []
    );

    return {
        props: {
            errorCode: !shopType ? 404 : null,
            shopType,
            accessToken,
            content,
            products,
            count,
        },
    };
};

interface ShopTypeProps {
    shopType: ProductType | null;
    accessToken: CreateToken;
    content: Document[] | null;
    products: Product[] | null;
    count: number;
}

export const ShopType: React.FC<ShopTypeProps> = ({ shopType, accessToken, content, products, count }) => {
    const dispatch = useDispatch();
    const shouldUpperCase = shopType === ProductType.UFC;
    const caseChangedShopType = shouldUpperCase ? upperCase(shopType || '') : startCase(shopType || '');

    useEffect(() => {
        if (shopType) {
            dispatch(setUrlProductType(shopType));
        } else {
            dispatch(removeAllProductTypes());
        }
    }, [dispatch, shopType]);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    useEffect(() => {
        dispatch(setIsLoadingProducts(true));
        dispatch(setProductsAndCount({ products, count }));
    }, [dispatch, products, count]);

    return (
        <PageWrapper
            title={`${caseChangedShopType} | Shop | King of Cardboard`}
            description={`${caseChangedShopType} cards, sealed product and memorabilia.`}
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={content} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters />
                    <Grid />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopType;
