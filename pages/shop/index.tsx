import React from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import LatestProductRows from '../../components/Shop/LatestProductRows';
import { Product } from '../../types/products';
import { listProductRows, listProducts } from '../../utils/account/products';
import { DEFAULT_STOCK_STATUSES } from '../../utils/constants';
import { SortOption } from '../../enums/products';
import { parseAsArrayOfStrings, parseAsString, safelyParse } from '../../utils/parsers';
import { toNumber } from 'lodash';

const LIMIT = 4;
const SKIP = 0;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { content } = await getPageBySlug('shop', '');
    const searchTerm = safelyParse(query, 's', parseAsString, '');
    const sort = safelyParse(query, 'sort', parseAsString, '');
    const categories = safelyParse(query, 'cat', parseAsArrayOfStrings, []);
    const configurations = safelyParse(query, 'config', parseAsArrayOfStrings, []);
    const interests = safelyParse(query, 'interest', parseAsArrayOfStrings, []);
    const status = safelyParse(query, 'status', parseAsArrayOfStrings, []);
    const hasFilters =
        searchTerm.length > 0 ||
        sort.length > 0 ||
        categories.length > 0 ||
        interests.length > 0 ||
        configurations.length > 0 ||
        status.length > 0;

    if (hasFilters) {
        const { products, count } = await listProducts(
            4,
            0,
            true,
            categories.length > 0 ? categories.map((cat) => toNumber(cat)) : [],
            configurations.length > 0 ? configurations.map((con) => toNumber(con)) : [],
            interests.length > 0 ? interests.map((interest) => toNumber(interest)) : [],
            status.length > 0 ? status.map((sta) => toNumber(sta)) : DEFAULT_STOCK_STATUSES,
            searchTerm.length > 0 ? searchTerm : '',
            sort.length > 0 ? toNumber(sort) : SortOption.DateAddedDesc
        );

        return {
            props: {
                content,
                products,
                productsTotal: count,
                hasFilters,
            },
        };
    } else {
        const productFacets = await listProductRows(LIMIT, SKIP, true);

        return {
            props: {
                content,
                products: [
                    ...productFacets.baseball,
                    ...productFacets.basketball,
                    ...productFacets.football,
                    ...productFacets.soccer,
                    ...productFacets.ufc,
                    ...productFacets.wrestling,
                    ...productFacets.tcg,
                    ...productFacets.other,
                    ...productFacets.f1,
                ],
                productsTotal: 0,
                hasFilters,
            },
        };
    }
};

interface ShopProps {
    content: Document | null;
    products: Product[];
    productsTotal: number;
    hasFilters: boolean;
}

export const ShopPage: React.FC<ShopProps> = ({ content, products, productsTotal, hasFilters }) => {
    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="Sealed sports cards boxes, individual cards, imports and pre-orders for UK collectors. Collect your favourite teams and players from the Premier League, NFL, NBA, UFC and WWE."
        >
            <div className="flex flex-col w-full relative space-y-4">
                <div className="block w-full">{content && <Content content={[content]} />}</div>
                {!hasFilters ? (
                    <div className="flex flex-col w-full relative space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <Filters />
                        <LatestProductRows products={products} />
                    </div>
                ) : (
                    <div className="flex flex-col w-full relative space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <Filters />
                        <Grid products={products} productsTotal={productsTotal} />
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
