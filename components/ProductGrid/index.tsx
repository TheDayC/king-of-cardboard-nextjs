import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

import selector from './selector';
import { fetchContentfulProducts, mergeProductData } from '../../utils/products';
import { getSkus } from '../../utils/commerce';
import { Product } from '../../types/products';

interface ProductGridProps {
    useFilters: boolean;
}

const LIMIT = 9;

export const ProductGrid: React.FC<ProductGridProps> = ({ useFilters }) => {
    const { filters, accessToken, currentPage } = useSelector(selector);
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[] | null>(null);

    const createProductCollection = useCallback(
        async (accessToken: string, currentPage: number) => {
            const pageNegative = currentPage - 1;

            // First, find our contentful products with links.
            // Use Limit for max products per request.
            // Multiply the pageNegative (needs to start at 0) by the limit to skip over the same amount of products each time.
            const foundProducts = await fetchContentfulProducts(LIMIT, pageNegative * LIMIT);

            // If we find products then move on to fetching by SKU in commerce layer.
            if (foundProducts) {
                const sku_codes = foundProducts.map((p) => p.productLink);
                const skuItems = await getSkus(accessToken, sku_codes);

                // If we hit some skuItems then put them in the store.
                if (skuItems) {
                    const mergedProducts = mergeProductData(foundProducts, skuItems);
                    setProducts(mergedProducts);
                }
            }
        },
        [dispatch]
    );

    // Create the product collection on load.
    useEffect(() => {
        if (!products && accessToken && currentPage) {
            createProductCollection(accessToken, currentPage);
        }
    }, [products, accessToken, currentPage]);

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
                                        <h2 className="card-title text-center">{product.name}</h2>
                                        {product.tags && (
                                            <div className="flex flex-row flex-wrap justify-start items-center">
                                                {product.tags.map((tag) => (
                                                    <div className="badge m-2 badge-secondary badge-outline">{tag}</div>
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
        </div>
    );
};

export default ProductGrid;
