import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import selector from './selector';
import Pagination from '../../Pagination';
import ProductCard from './ProductCard';
import { fetchProducts, setIsLoadingProducts } from '../../../store/slices/products';
import Skeleton from './skeleton';
import NoProducts from './NoProducts';
import { FilterMode } from '../../../enums/shop';
import ImportCard from './ImportCard';
import { fetchImports, setIsLoadingImports } from '../../../store/slices/imports';

const PER_PAGE = 8;

interface GridProps {
    mode: FilterMode;
}

export const Grid: React.FC<GridProps> = ({ mode }) => {
    const { accessToken, products, productsTotal, isLoadingProducts, imports, isLoadingImports } =
        useSelector(selector);
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(0);
    const productPageCount = ceil(divide(productsTotal, PER_PAGE));
    const isImports = mode === FilterMode.Imports;

    // Handle the page number and set it in local state.
    const handlePageNumber = useCallback(
        (pageNumber: number) => {
            if (accessToken) {
                const fetchConfig = {
                    limit: PER_PAGE,
                    skip: pageNumber * PER_PAGE,
                };
                setCurrentPage(pageNumber);

                if (isImports) {
                    dispatch(setIsLoadingImports(true));
                    dispatch(fetchImports(fetchConfig));
                } else {
                    dispatch(setIsLoadingProducts(true));
                    dispatch(fetchProducts(fetchConfig));
                }
            }
        },
        [accessToken, dispatch, isImports]
    );

    if (isImports) {
        if (isLoadingImports) {
            return (
                <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
                    <Skeleton />
                </div>
            );
        }

        return (
            <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
                {imports.length > 0 ? (
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
                        {imports.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`product-card-${i.name}`}
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
    } else {
        if (isLoadingProducts) {
            return (
                <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
                    <Skeleton />
                </div>
            );
        }

        return (
            <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
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
    }
};

export default Grid;
