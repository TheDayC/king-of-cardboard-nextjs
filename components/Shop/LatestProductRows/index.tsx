import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { BiFootball, BiBall, BiBasketball, BiBaseball } from 'react-icons/bi';
import { SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { GiPunch } from 'react-icons/gi';
import { BsArrowRightCircle } from 'react-icons/bs';

import selector from './selector';
import ProductCard from '../Grid/ProductCard';
import { getPrettyPrice } from '../../../utils/account/products';

const iconClassName = 'w-10 h-10 inline-block -mt-1 ml-2';

export const LatestProductRows: React.FC = () => {
    const {
        baseballProducts,
        basketballProducts,
        footballProducts,
        soccerProducts,
        ufcProducts,
        wrestlingProducts,
        pokemonProducts,
    } = useSelector(selector);

    const rows = [
        {
            title: 'Baseball',
            description: 'Officially licensed and unlicensed MLB sports cards, sealed product and packs.',
            shouldShow: baseballProducts.length > 0,
            products: baseballProducts,
            link: '/shop/baseball',
            icon: <BiBaseball className={`${iconClassName} text-red-500`} />,
        },
        {
            title: 'Basketball',
            description: 'Officially licensed NBA sports cards, sealed product and packs.',
            shouldShow: basketballProducts.length > 0,
            products: basketballProducts,
            link: '/shop/basketball',
            icon: <BiBasketball className={`${iconClassName} text-orange-500`} />,
        },
        {
            title: 'Football',
            description: 'Officially licensed NFL sports cards, sealed product and packs.',
            shouldShow: footballProducts.length > 0,
            products: footballProducts,
            link: '/shop/football',
            icon: <BiBall className={`${iconClassName} text-amber-900`} />,
        },
        {
            title: 'Soccer',
            description: 'Officially licensed Premier League, UEFA and FIFA sports cards, sealed product and packs.',
            shouldShow: soccerProducts.length > 0,
            products: soccerProducts,
            link: '/shop/soccer',
            icon: <BiFootball className={`${iconClassName} text-black`} />,
        },
        {
            title: 'UFC',
            description: 'Officially licensed UFC sports cards, sealed product and packs.',
            shouldShow: ufcProducts.length > 0,
            products: ufcProducts,
            link: '/shop/ufc',
            icon: <GiPunch className={`${iconClassName} text-red-500`} />,
        },
        {
            title: 'Wrestling',
            description: 'Officially licensed WWE and AEW sports cards, sealed product and packs.',
            shouldShow: wrestlingProducts.length > 0,
            products: wrestlingProducts,
            link: '/shop/wrestling',
            icon: <SiWwe className={`${iconClassName} text-red-500`} />,
        },
        {
            title: 'Pokemon',
            description: 'Officially licensed Pokemon trading cards, sealed product and packs.',
            shouldShow: pokemonProducts.length > 0,
            products: pokemonProducts,
            link: '/shop/pokemon',
            icon: <MdOutlineCatchingPokemon className={`${iconClassName} text-red-500`} />,
        },
    ];

    return (
        <div className="flex flex-col w-full md:w-4/6 md:space-y-4 xl:w-5/6">
            {rows.map(({ title, description, shouldShow, products, link, icon }) => {
                if (!shouldShow) return null;

                return (
                    <div className="flex flex-col space-y-4" key={`product-row-${title}`}>
                        <div className="flex flex-row">
                            <Link href={link} passHref>
                                <h2 className="text-4xl hover:underline">
                                    {title}
                                    {icon}
                                </h2>
                            </Link>
                        </div>
                        <p>{description}</p>
                        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
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
                                    stock={product.quantity}
                                    stockStatus={product.stockStatus}
                                    releaseDate={product.releaseDate}
                                    key={`product-${product.slug}`}
                                />
                            ))}
                        </div>
                        <div className="flex flex-row justify-end">
                            <Link href={link} passHref>
                                <button className="btn btn-secondary rounded-md shadow-md w-full">
                                    View all {title}
                                    <BsArrowRightCircle className="w-6 h-6 inline-block ml-2" />
                                </button>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LatestProductRows;
