import { upperCase, upperFirst } from 'lodash';
import React from 'react';

import { ProductType } from '../../../enums/shop';
import { Product } from '../../../types/products';
import ProductCard from '../Grid/ProductCard';

interface LatestProductRowsProps {
    basketballProducts: Product[];
    footballProducts: Product[];
    soccerProducts: Product[];
    ufcProducts: Product[];
    wweProducts: Product[];
    pokemonProducts: Product[];
}

export const LatestProductRows: React.FC<LatestProductRowsProps> = ({
    basketballProducts,
    footballProducts,
    soccerProducts,
    ufcProducts,
    wweProducts,
    pokemonProducts,
}) => {
    return (
        <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
            {/* isLoadingProducts && <Skeleton /> */}
            {basketballProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Basketball)}</h2>
                    <p>Officially licensed NBA sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {basketballProducts.map((product) => (
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
                </div>
            )}
            {footballProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Football)}</h2>
                    <p>Officially licensed NFL sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {footballProducts.map((product) => (
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
                </div>
            )}
            {soccerProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Soccer)}</h2>
                    <p>Officially licensed Premier League, UEFA and FIFA sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {soccerProducts.map((product) => (
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
                </div>
            )}
            {ufcProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperCase(ProductType.UFC)}</h2>
                    <p>Officially licensed UFC sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {ufcProducts.map((product) => (
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
                </div>
            )}
            {wweProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Wrestling)}</h2>
                    <p>Officially licensed WWE sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {wweProducts.map((product) => (
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
                </div>
            )}
            {pokemonProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Pokemon)}</h2>
                    <p>Officially licensed Pokemon trading cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {pokemonProducts.map((product) => (
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
                </div>
            )}
        </div>
    );
};

export default LatestProductRows;
