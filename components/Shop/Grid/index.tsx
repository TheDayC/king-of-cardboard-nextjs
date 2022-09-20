import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import selector from './selector';
import Pagination from '../../Pagination';
import ProductCard from './ProductCard';
import { clearCurrentProduct, fetchProducts, setIsLoadingProducts } from '../../../store/slices/products';
import Skeleton from './skeleton';
import NoProducts from './NoProducts';

const PER_PAGE = 8;

export const Grid: React.FC = () => {
    const { accessToken, categories, productTypes, products, productsTotal, isLoadingProducts } = useSelector(selector);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const productPageCount = ceil(divide(productsTotal, PER_PAGE));

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            if (accessToken) {
                dispatch(setIsLoadingProducts(true));
                setCurrentPage(pageNumber);
                dispatch(
                    fetchProducts({
                        limit: PER_PAGE,
                        skip: pageNumber * PER_PAGE,
                    })
                );
            }
        },
        [accessToken, categories, productTypes, dispatch]
    );

    return (
        <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
            {isLoadingProducts && <Skeleton />}
            {products.length > 0 ? (
                <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
                    {products.map((product) => (
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
            ) : (
                <NoProducts />
            )}
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
