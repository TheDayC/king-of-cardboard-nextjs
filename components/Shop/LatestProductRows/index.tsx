import { upperCase, upperFirst } from 'lodash';
import React from 'react';

import { Interest } from '../../../enums/products';
import { ShallowProduct } from '../../../types/products';
import ProductCard from '../Grid/ProductCard';
import { Product } from '../../../types/productsNew';
import { getPrettyPrice } from '../../../utils/account/products';

interface LatestProductRowsProps {
    baseballProducts: Product[];
    basketballProducts: Product[];
    footballProducts: Product[];
    soccerProducts: Product[];
    ufcProducts: Product[];
    wrestlingProducts: Product[];
    pokemonProducts: Product[];
}

export const LatestProductRows: React.FC<LatestProductRowsProps> = ({
    baseballProducts,
    basketballProducts,
    footballProducts,
    soccerProducts,
    ufcProducts,
    wrestlingProducts,
    pokemonProducts,
}) => {
    const rows = [
        {
            title: 'Baseball',
            description: 'Officially licensed and unlicensed MLB sports cards, sealed product and packs.',
            shouldShow: baseballProducts.length > 0,
            products: baseballProducts,
        },
        {
            title: 'Basketball',
            description: 'Officially licensed NBA sports cards, sealed product and packs.',
            shouldShow: basketballProducts.length > 0,
            products: basketballProducts,
        },
        {
            title: 'Football',
            description: 'Officially licensed NFL sports cards, sealed product and packs.',
            shouldShow: footballProducts.length > 0,
            products: footballProducts,
        },
        {
            title: 'Soccer',
            description: 'Officially licensed Premier League, UEFA and FIFA sports cards, sealed product and packs.',
            shouldShow: soccerProducts.length > 0,
            products: soccerProducts,
        },
        {
            title: 'UFC',
            description: 'Officially licensed UFC sports cards, sealed product and packs.',
            shouldShow: ufcProducts.length > 0,
            products: ufcProducts,
        },
        {
            title: 'Wrestling',
            description: 'Officially licensed WWE and AEW sports cards, sealed product and packs.',
            shouldShow: wrestlingProducts.length > 0,
            products: wrestlingProducts,
        },
        {
            title: 'Pokemon',
            description: 'Officially licensed Pokemon trading cards, sealed product and packs.',
            shouldShow: pokemonProducts.length > 0,
            products: pokemonProducts,
        },
    ];

    return (
        <div className="flex flex-col w-full md:w-5/6">
            {rows.map(({ title, description, shouldShow, products }) => {
                if (!shouldShow) return null;

                return (
                    <div className="flex flex-col mb-8" key={`product-row-${title}`}>
                        <h2 className="text-4xl mb-2">{title}</h2>
                        <p>{description}</p>
                        <hr className="divider lightDivider" />
                        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LatestProductRows;
