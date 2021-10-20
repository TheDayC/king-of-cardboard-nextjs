import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

import selector from './selector';
import ProductButtons from './ProductButtons';
import {
    fetchContentfulProducts,
    fetchProductCollection,
    filterProducts,
    hydrateProductCollection,
    mergeProductData,
} from '../../utils/products';
import { getPrices, getSkus, getStockItems } from '../../utils/commerce';
import { PRODUCT_QUERY } from '../../utils/content';
import { addProductCollection, addSkuItems } from '../../store/slices/products';
import { Product } from '../../types/products';
import { SkuItem } from '../../types/commerce';
// import styles from './productgrid.module.css';

interface ProductGridProps {
    useFilters: boolean;
}

const LIMIT = 9;

export const ProductGrid: React.FC<ProductGridProps> = ({ useFilters }) => {
    const { filters, accessToken, currentPage } = useSelector(selector);
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[] | null>(null);

    /* const filteredProducts = useMemo(
        () => (useFilters ? filterProducts(products, filters) : products),
        [products, filters, useFilters]
    ); */

    const createProductCollection = useCallback(
        async (accessToken: string, currentPage: number) => {
            /* const stockItems = await getStockItems(accessToken, currentPage);
            const prices = await getPrices(accessToken);
            const products = await fetchProductCollection(PRODUCT_QUERY, stockItems, prices);

            dispatch(addProductCollection(products)); */
            const pageNegative = currentPage - 1;

            // First, find our contentful products with links.
            // Use Limit for max products per request.
            // Multiply the pageNegative (needs to start at 0) by the limit to skip over the same amount of products each time.
            const foundProducts = await fetchContentfulProducts(LIMIT, pageNegative * LIMIT);

            // If we find products then move on to fetching by SKU in commerce layer.
            if (foundProducts) {
                const sku_codes = foundProducts.map((p) => p.sku);
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
                    products.map((product) => (
                        <div className="card shadow-md rounded-md image-full" key={product.name}>
                            {product.cardImage && (
                                <Image
                                    src={product.cardImage.url}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-sm"
                                />
                            )}
                            <div className="justify-end card-body">
                                <h2 className="card-title">
                                    {product.name}
                                    <div className="badge mx-2 badge-secondary">NEW</div>
                                </h2>
                                <p>{/* product.description */}</p>
                                <div className="card-actions">
                                    <Link href={`/shop/${product.slug}`} passHref>
                                        <button className="btn btn-primary">View Product</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ProductGrid;
