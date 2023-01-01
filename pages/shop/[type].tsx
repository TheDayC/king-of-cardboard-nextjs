import React, { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { addCategory, addInterest, resetFilters } from '../../store/slices/filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { fetchProducts, setIsLoadingProducts, setProductsAndCount } from '../../store/slices/products';
import { getCategoryByInterest, getInterestBySlug, listProducts } from '../../utils/account/products';
import { Category, Configuration, Interest, SortOption, StockStatus } from '../../enums/products';
import { Product } from '../../types/products';
import selector from './selector';

const LIMIT = 8;
const SKIP = 0;
const CONFIGURATIONS: Configuration[] = [];
const STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];

export const getServerSideProps: GetServerSideProps = async (context) => {
    const staticInterest = safelyParse(context, 'query.type', parseAsString, '');
    const interest = getInterestBySlug(staticInterest);
    const category = getCategoryByInterest(interest);
    const { content } = await getPageBySlug(staticInterest, 'shop/');
    const { products, count } = await listProducts(
        LIMIT,
        SKIP,
        true,
        [category],
        CONFIGURATIONS,
        [interest],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc
    );

    return {
        props: {
            interest,
            category,
            staticInterest,
            content,
            products,
            count,
        },
    };
};

interface ShopTypeProps {
    interest: Interest;
    staticInterest: string;
    category: Category;
    content: Document | null;
    products: Product[] | null;
    count: number;
}

export const ShopType: React.FC<ShopTypeProps> = ({ interest, staticInterest, category, content, products, count }) => {
    const dispatch = useDispatch();
    const { sortOption, searchTerm } = useSelector(selector);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const shouldUpperCase = interest === Interest.UFC;
    const caseChangedShopType = shouldUpperCase ? upperCase(staticInterest) : startCase(staticInterest);

    // On page load set the server side fetched products
    useEffect(() => {
        if (!setIsInitialLoad) return;

        dispatch(setIsLoadingProducts(true));

        // Reset the filters for the shop to show a default state.
        dispatch(resetFilters());

        // Update the shop products.
        dispatch(
            setProductsAndCount({
                products,
                count,
            })
        );

        // Set the current interest and category.
        dispatch(addInterest(interest));
        dispatch(addCategory(category));

        setIsInitialLoad(false);
    }, [dispatch, products, interest, category, count, isInitialLoad]);

    // If the search term is changed then fetch products.
    useEffect(() => {
        if (isInitialLoad) return;

        dispatch(setIsLoadingProducts(true));

        dispatch(fetchProducts({ limit: LIMIT, skip: 0 }));
    }, [dispatch, sortOption, searchTerm, isInitialLoad]);

    return (
        <PageWrapper
            title={`${caseChangedShopType} | Shop | King of Cardboard`}
            description={`${caseChangedShopType} cards, sealed product and memorabilia.`}
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={[content]} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters />
                    <Grid />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopType;
