import { FC } from 'react';

import { Product } from '../../types/products';
import ProductCard from '../Shop/Grid/ProductCard';
import { getPrettyPrice } from '../../utils/account/products';

interface LatestArrivalsProps {
    products: Product[];
}

export const LatestArrivals: FC<LatestArrivalsProps> = ({ products }) => {
    return (
        <div className="flex flex-col w-full max-w-7xl">
            <h3 className="font-bold mb-4 text-xl lg:text-4xl">Latest Arrivals</h3>
            <div className="grid gap-y-4 gap-x-4 xl:gap-y-0 xl:gap-x-4 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {products.map((product) => {
                    const percentageChange =
                        product.salePrice > 0 ? ((product.price - product.salePrice) / product.salePrice) * 100 : null;

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
                            key={`latest-arrival-card-${product.slug}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default LatestArrivals;
