import { FC, useEffect, useState } from 'react';

import ProductCard from '../Shop/Grid/ProductCard';
import { getCrossSales, getPrettyPrice } from '../../utils/account/products';
import { Category, Configuration, Interest } from '../../enums/products';
import { Product } from '../../types/products';

interface CrossSalesProps {
    id: string;
    category: Category;
    configuration: Configuration;
    interest: Interest;
}

export const CrossSales: FC<CrossSalesProps> = ({ id, category, configuration, interest }) => {
    const [crossSales, setCrossSales] = useState<Product[] | null>(null);

    useEffect(() => {
        getCrossSales(id, category, configuration, interest).then((cS) => {
            setCrossSales(cS.length ? cS : null);
        });
    }, [id, category, interest, configuration]);

    if (!crossSales) return null;

    return (
        <div className="flex flex-col w-full">
            <h3 className="font-bold mb-4 text-xl lg:text-4xl">You might also like</h3>
            <div className="grid gap-y-4 gap-x-4 xl:gap-y-0 xl:gap-x-4 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {crossSales.map((product) => {
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

export default CrossSales;
