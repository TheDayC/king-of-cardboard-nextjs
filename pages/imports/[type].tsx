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
import { Categories, FilterMode, ProductType } from '../../enums/shop';
import { setImportsAndCount, setIsLoadingImports } from '../../store/slices/imports';
import { ShallowImport } from '../../types/imports';
import { getShallowImports } from '../../utils/imports';

const LIMIT = 8;
const SKIP = 0;
const CATEGORIES: Categories[] = [];
const DEFAULT_IMPORTS: ShallowImport[] = [];

export const getServerSideProps: GetServerSideProps = async (context) => {
    const accessToken = await createToken();
    const slug = safelyParse(context, 'query.type', parseAsProductType, null);

    if (!accessToken.token || !slug) {
        return {
            props: {
                errorCode: 500,
                shopType: null,
                accessToken,
                content: null,
                imports: DEFAULT_IMPORTS,
                count: 0,
            },
        };
    }

    const shopType = safelyParse(context, 'query.type', parseAsProductType, null);
    const content = await pageBySlug(shopType, 'shop/');
    const { imports, count } = await getShallowImports(accessToken.token, LIMIT, SKIP, CATEGORIES, [slug]);

    return {
        props: {
            errorCode: !shopType ? 404 : null,
            shopType,
            accessToken,
            content,
            imports,
            count,
        },
    };
};

interface ShopTypeProps {
    shopType: ProductType | null;
    accessToken: CreateToken;
    content: Document[] | null;
    imports: ShallowImport[] | null;
    count: number;
}

export const ShopType: React.FC<ShopTypeProps> = ({ shopType, accessToken, content, imports, count }) => {
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
                    <Filters mode={FilterMode.Imports} />
                    <Grid mode={FilterMode.Imports} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopType;
