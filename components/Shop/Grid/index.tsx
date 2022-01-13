import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import selector from './selector';
import Pagination from '../../Pagination';
import { setIsLoadingProducts } from '../../../store/slices/shop';
import ProductCard from './ProductCard';
import { fetchProducts, fetchProductsTotal } from '../../../store/slices/products';

const PER_PAGE = 9;

export const Grid: React.FC = () => {
    const { accessToken, categories, productTypes, products, productsTotal } = useSelector(selector);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const [shouldFetch, setShouldFetch] = useState(true);
    const productPageCount = ceil(divide(productsTotal, PER_PAGE));
    const hasFilters = categories.length > 0 || productTypes.length > 0;

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            if (accessToken) {
                dispatch(setIsLoadingProducts(true));
                setCurrentPage(pageNumber);
                dispatch(fetchProducts({ accessToken, limit: pageNumber, skip: PER_PAGE, categories, productTypes }));
                dispatch(setIsLoadingProducts(false));
            }
        },
        [accessToken, categories, productTypes, dispatch]
    );

    // Create the product collection on load.
    useEffect(() => {
        if (shouldFetch && accessToken) {
            setShouldFetch(false);
            dispatch(fetchProductsTotal());
            dispatch(fetchProducts({ accessToken, limit: 0, skip: 0, categories, productTypes }));
        }
    }, [dispatch, accessToken, shouldFetch, categories, productTypes]);

    // Filter the collection.
    useEffect(() => {
        if (accessToken && hasFilters) {
            dispatch(fetchProductsTotal());
            dispatch(fetchProducts({ accessToken, limit: 0, skip: 0, categories, productTypes }));
        }
    }, [dispatch, accessToken, categories, productTypes, hasFilters]);

    return (
        <div className="flex flex-col w-5/6" data-testid="shop-grid">
            <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
                {products.length > 0 &&
                    products.map((product) => (
                        <ProductCard
                            name={product.name}
                            image={product.cardImage.url}
                            imgDesc={product.cardImage.description}
                            imgTitle={product.cardImage.title}
                            tags={product.tags}
                            amount={product.amount}
                            compareAmount={product.compare_amount}
                            slug={product.slug}
                            key={`product-card-${product.name}`}
                        />
                    ))}
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
