import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsProductType, parseAsString, safelyParse } from '../../utils/parsers';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { Categories, FilterMode, ProductType } from '../../enums/shop';
import { getProducts } from '../../utils/products';
import { setIsLoadingProducts, setProductsAndCount } from '../../store/slices/products';
import { getInterestBySlug, listProducts } from '../../utils/account/products';
import { Category, Configuration, Interest } from '../../enums/products';
import { Product } from '../../types/productsNew';
import { isNumber } from '../../utils/typeguards';

const LIMIT = 8;
const SKIP = 0;
const CATEGORIES: Category[] = [];
const CONFIGURATIONS: Configuration[] = [];
const INTERESTS: Interest[] = [];
const DEFAULT_PRODUCTS: Product[] = [];

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shopType = safelyParse(context, 'query.type', parseAsString, '');
    const interest = getInterestBySlug(shopType);
    const { content } = await getPageBySlug(shopType, 'shop/');
    const { products, count } = await listProducts(
        LIMIT,
        SKIP,
        CATEGORIES,
        CONFIGURATIONS,
        isNumber(interest) ? [interest] : INTERESTS
    );

    return {
        props: {
            interest,
            shopType,
            content,
            products,
            count,
        },
    };
};

interface ShopTypeProps {
    interest: Interest;
    shopType: string;
    content: Document | null;
    products: Product[] | null;
    count: number;
}

export const ShopType: React.FC<ShopTypeProps> = ({ interest, shopType, content, products, count }) => {
    const dispatch = useDispatch();
    const shouldUpperCase = interest === Interest.UFC;
    const caseChangedShopType = shouldUpperCase ? upperCase(shopType) : startCase(shopType);

    useEffect(() => {
        if (shopType) {
            dispatch(setUrlProductType(shopType));
        } else {
            dispatch(removeAllProductTypes());
        }
    }, [dispatch, shopType]);

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
                {content && <Content content={[content]} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters mode={FilterMode.Products} />
                    <Grid mode={FilterMode.Products} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopType;
