import { upperCase, upperFirst } from 'lodash';
import React from 'react';

import { ProductType } from '../../../enums/shop';
import { ShallowImport } from '../../../types/imports';
import ImportCard from '../Grid/ImportCard';

interface LatestImportRowsProps {
    baseballProducts: ShallowImport[];
    basketballProducts: ShallowImport[];
    footballProducts: ShallowImport[];
    soccerProducts: ShallowImport[];
    ufcProducts: ShallowImport[];
    wweProducts: ShallowImport[];
    pokemonProducts: ShallowImport[];
}

export const LatestImportRows: React.FC<LatestImportRowsProps> = ({
    baseballProducts,
    basketballProducts,
    footballProducts,
    soccerProducts,
    ufcProducts,
    wweProducts,
    pokemonProducts,
}) => {
    return (
        <div className="flex flex-col w-full md:w-5/6" data-testid="shop-grid">
            {baseballProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Baseball)}</h2>
                    <p>Officially licensed and unlicensed MLB sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {baseballProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            {basketballProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Basketball)}</h2>
                    <p>Officially licensed NBA sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {basketballProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
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
                        {footballProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
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
                        {soccerProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
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
                        {ufcProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            {wweProducts.length > 0 && (
                <div className="flex flex-col mb-8">
                    <h2 className="text-4xl mb-2">{upperFirst(ProductType.Wrestling)}</h2>
                    <p>Officially licensed WWE and AEW sports cards, sealed product and packs.</p>
                    <hr className="divider lightDivider" />
                    <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                        {wweProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
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
                        {pokemonProducts.map((i) => (
                            <ImportCard
                                name={i.name}
                                image={i.image.url}
                                imgDesc={i.image.description}
                                imgTitle={i.image.title}
                                tags={i.tags}
                                amount={i.amount}
                                compareAmount={i.compareAmount}
                                slug={i.slug}
                                key={`import-card-${i.name}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LatestImportRows;
