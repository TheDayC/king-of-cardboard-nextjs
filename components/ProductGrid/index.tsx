import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { ceil, divide } from 'lodash';

import selector from './selector';
import { fetchContentfulProducts, mergeProductData } from '../../utils/products';
import { getSkus } from '../../utils/commerce';
import { Product } from '../../types/products';
import Pagination from '../Pagination';
import { Categories, ProductType } from '../../enums/shop';
import { setIsLoadingProducts } from '../../store/slices/shop';

interface ProductGridProps {
    useFilters: boolean;
}

const PRODUCTS_PER_PAGE = 9;

export const ProductGrid: React.FC<ProductGridProps> = ({ useFilters }) => {
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

                // If we hit some skuItems then put them in the store.
                if (skuItems) {
                    const mergedProducts = mergeProductData(productCollection, skuItems);
                    setProducts(mergedProducts);
                    dispatch(setIsLoadingProducts(false));
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
            <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl2:grid-cols-4 gap-4">
                {products &&
                    products.map((product) => {
                        const shouldShowCompare = product.amount !== product.compare_amount;

                        return (
                            <div className="card shadow-md rounded-md image-full" key={product.name}>
                                {product.cardImage && (
                                    <Image
                                        src={product.cardImage.url}
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-sm"
                                    />
                                )}
                                <div className="justify-between items-center card-body px-6 py-4">
                                    <div className="flex flex-col justify-start items-center">
                                        <h2 className="card-title text-center text-2xl">{product.name}</h2>
                                        {product.tags && (
                                            <div className="flex flex-row flex-wrap justify-start items-center">
                                                {product.tags.map((tag) => (
                                                    <div
                                                        className="badge m-2 badge-secondary badge-outline"
                                                        key={`tag-${tag}`}
                                                    >
                                                        {tag}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-actions w-full">
                                        <div
                                            className={`flex flex-row ${
                                                shouldShowCompare ? 'justify-between' : 'justify-end'
                                            } items-center w-full`}
                                        >
                                            {shouldShowCompare && (
                                                <span className="text-xs line-through text-base-200 mr-2 mt-1">
                                                    {product.compare_amount}
                                                </span>
                                            )}
                                            <span className="text-lg font-bold">{product.amount}</span>
                                        </div>
                                        <Link href={`/shop/${product.slug}`} passHref>
                                            <button className="btn btn-primary btn-sm rounded-md shadow-md w-full">
                                                View Product
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
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

export default ProductGrid;
