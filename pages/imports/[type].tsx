import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllInterests, setStaticPageInterest } from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { FilterMode, ProductType } from '../../enums/shop';
import { setImportsAndCount, setIsLoadingImports } from '../../store/slices/imports';
import { ShallowImport } from '../../types/imports';
import { listProducts } from '../../utils/account/products';

const LIMIT = 8;
const SKIP = 0;
const DEFAULT_IMPORTS: ShallowImport[] = [];

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.type', parseAsString, null);

    if (!slug) {
        return {
            props: {
                errorCode: 500,
                shopType: null,
                content: null,
                imports: DEFAULT_IMPORTS,
                count: 0,
            },
        };
    }

    const { content } = await getPageBySlug(slug, 'shop/');
    const { products, count } = await listProducts(LIMIT, SKIP);

    return {
        props: {
            shopType: slug,
            content,
            imports: products,
            count,
        },
    };
};

interface ShopTypeProps {
    shopType: ProductType | null;
    content: Document[] | null;
    imports: ShallowImport[] | null;
    count: number;
}

export const ShopType: React.FC<ShopTypeProps> = ({ shopType, content, imports, count }) => {
    const dispatch = useDispatch();
    const shouldUpperCase = shopType === ProductType.UFC;
    const caseChangedShopType = shouldUpperCase ? upperCase(shopType || '') : startCase(shopType || '');

    useEffect(() => {
        if (shopType) {
            dispatch(setStaticPageInterest(shopType));
        } else {
            dispatch(removeAllInterests());
        }
    }, [dispatch, shopType]);

    useEffect(() => {
        dispatch(setIsLoadingImports(true));
        dispatch(setImportsAndCount({ imports, count }));
    }, [dispatch, imports, count]);

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
