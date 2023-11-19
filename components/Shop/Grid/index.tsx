import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import selector from './selector';
import Pagination from '../../Pagination';
import ProductCard from './ProductCard';
import Skeleton from './skeleton';
import NoProducts from './NoProducts';
import { getPrettyPrice } from '../../../utils/account/products';
import { fetchProducts } from '../../../store/slices/products';

const LIMIT = 8;

export const Grid: React.FC = () => {
    const dispatch = useDispatch();
    const { products, productsTotal, isLoadingProducts } = useSelector(selector);
    const [currentPage, setCurrentPage] = useState(0);
    const productPageCount = ceil(divide(productsTotal, LIMIT));

    // Handle the page number and set it in local state.
    const handlePageNumber = (nextPage: number) => {
        setCurrentPage(nextPage);
        dispatch(fetchProducts({ limit: LIMIT, skip: LIMIT * nextPage }));
    };

    if (isLoadingProducts) {
        return (
            <div className="flex flex-col w-full md:w-4/6 xl:w-full" data-testid="shop-grid">
                <Skeleton />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full md:w-4/6 md:space-y-4 xl:w-full" data-testid="shop-grid">
            {products.length > 0 ? (
                <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {products.map((product) => {
                        const percentageChange =
                            product.salePrice > 0
                                ? ((product.price - product.salePrice) / product.salePrice) * 100
                                : null;

                        return (
                            <ProductCard
                                name={product.title}
                                image={product.mainImage}
                                imgDesc={`${product.title} primary image`}
                                imgTitle={`${product.title} image`}
                                tags={[]}
                                amount={getPrettyPrice(product.price)}
                                compareAmount={getPrettyPrice(product.salePrice)}
                                slug={product.slug}
                                shouldShowCompare={product.salePrice > 0 && product.salePrice !== product.price}
                                stock={product.quantity}
                                stockStatus={product.stockStatus}
                                releaseDate={product.releaseDate}
                                percentageChange={percentageChange}
                                key={`product-card-${product.slug}`}
                            />
                        );
                    })}
                </div>
            ) : (
                <NoProducts />
            )}
            {productPageCount > 1 && (
                <div className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        pageCount={productPageCount}
                        handlePageNumber={handlePageNumber}
                    />
                </div>
            )}
        </div>
    );
};

export default Grid;
