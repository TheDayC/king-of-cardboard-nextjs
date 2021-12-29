import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { ceil, divide } from 'lodash';

import selector from './selector';
import { fetchContentfulProducts, mergeProductData } from '../../../utils/products';
import { getSkus } from '../../../utils/commerce';
import { Product } from '../../../types/products';
import Pagination from '../../Pagination';
import { Categories, ProductType } from '../../../enums/shop';
import { setIsLoadingProducts } from '../../../store/slices/shop';
import ProductCard from './ProductCard';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { isArrayOfErrors, isError } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';

const PRODUCTS_PER_PAGE = 9;

export const Grid: React.FC = () => {
    const { accessToken, filters } = useSelector(selector);
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [totalProducts, setTotalProducts] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const productPageCount = ceil(divide(totalProducts, PRODUCTS_PER_PAGE));

    const createProductCollection = useCallback(
        async (accessToken: string, currentPage: number, categories: Categories[], productTypes: ProductType[]) => {
            // First, find our contentful products with links.
            // Use Limit for max products per request.
            // Multiply the currentPage (needs to start at 0) by the limit to skip over the same amount of products each time.
            const { total, productCollection } = await fetchContentfulProducts(
                PRODUCTS_PER_PAGE,
                currentPage * PRODUCTS_PER_PAGE,
                categories,
                productTypes
            );

            // If we find products then move on to fetching by SKU in commerce layer.
            if (productCollection) {
                const sku_codes = productCollection.map((p) => p.productLink);
                const skuItems = await getSkus(accessToken, sku_codes);

                if (isArrayOfErrors(skuItems)) {
                    skuItems.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    // If we hit some skuItems then put them in the store.
                    if (skuItems) {
                        const mergedProducts = mergeProductData(productCollection, skuItems);
                        setProducts(mergedProducts);
                        dispatch(setIsLoadingProducts(false));
                    }
                }
            }

            // Set the total number of products for pagination.
            setTotalProducts(total);
        },
        [dispatch]
    );

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            dispatch(setIsLoadingProducts(true));
            setCurrentPage(pageNumber);

            if (accessToken) {
                createProductCollection(accessToken, pageNumber, filters.categories, filters.productTypes);
            }
        },
        [accessToken, filters.categories, filters.productTypes]
    );

    // Create the product collection on load.
    useEffect(() => {
        if (!products && accessToken) {
            createProductCollection(accessToken, 0, filters.categories, filters.productTypes);
        }
    }, [products, accessToken, filters.categories, filters.productTypes]);

    // Filter the collection.
    useEffect(() => {
        if (accessToken) {
            createProductCollection(accessToken, 0, filters.categories, filters.productTypes);
        }
    }, [accessToken, filters.categories, filters.productTypes]);

    return (
        <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl2:grid-cols-4 gap-4">
                {products &&
                    products.map((product) => {
                        const shouldShowCompare = product.amount !== product.compare_amount;
                        const { name, tags, amount, compare_amount, slug } = product;
                        const imgUrl = safelyParse(product, 'cardImage.url', parseAsString, null);
                        const imgDesc = safelyParse(product, 'cardImage.description', parseAsString, '');
                        const imgTitle = safelyParse(product, 'cardImage.title', parseAsString, '');

                        return (
                            <ProductCard
                                name={name}
                                image={imgUrl}
                                imgDesc={imgDesc}
                                imgTitle={imgTitle}
                                tags={tags}
                                shouldShowCompare={shouldShowCompare}
                                amount={amount}
                                compareAmount={compare_amount}
                                slug={slug}
                            />
                        );
                    })}
            </div>
            <div className="flex justify-center">
                {productPageCount > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        pageCount={productPageCount}
                        handlePageNumber={handlePageNumber}
                    />
                )}
            </div>
        </div>
    );
};

export default Grid;
