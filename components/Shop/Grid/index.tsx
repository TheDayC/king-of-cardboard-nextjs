import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ceil, divide } from 'lodash';

import selector from './selector';
import Pagination from '../../Pagination';
import ProductCard from './ProductCard';
import Skeleton from './skeleton';
import NoProducts from './NoProducts';
import { getPrettyPrice } from '../../../utils/account/products';

const PER_PAGE = 8;

export const Grid: React.FC = () => {
    const { products, productsTotal, isLoadingProducts } = useSelector(selector);
    const [currentPage, setCurrentPage] = useState(0);
    const productPageCount = ceil(divide(productsTotal, PER_PAGE));

    // Handle the page number and set it in local state.
    const handlePageNumber = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
                            name={product.title}
                            image={product.mainImage}
                            imgDesc={`${product.title} primary image`}
                            imgTitle={`${product.title} image`}
                            tags={[]}
                            amount={getPrettyPrice(product.price)}
                            compareAmount={getPrettyPrice(product.salePrice)}
                            slug={product.slug}
                            shouldShowCompare={product.salePrice > 0 && product.salePrice !== product.price}
                            key={`product-card-${product.slug}`}
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
