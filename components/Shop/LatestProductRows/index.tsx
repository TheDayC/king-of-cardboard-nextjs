import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { BsArrowRightCircle } from 'react-icons/bs';

import selector from './selector';
import ProductCard from '../Grid/ProductCard';
import { getPrettyPrice } from '../../../utils/account/products';
import { INTERESTS } from '../../../utils/constants';
import { Interest } from '../../../enums/products';

const iconClassName = 'w-10 h-10 inline-block -mt-1 ml-2';

export const LatestProductRows: React.FC = () => {
    const {
        baseballProducts,
        basketballProducts,
        footballProducts,
        soccerProducts,
        ufcProducts,
        wrestlingProducts,
        f1Products,
        tcgProducts,
        otherProducts,
    } = useSelector(selector);

    const findProducts = (interest: Interest) => {
        switch (interest) {
            case Interest.Baseball:
                return baseballProducts;
            case Interest.Basketball:
                return basketballProducts;
            case Interest.Football:
                return footballProducts;
            case Interest.Soccer:
                return soccerProducts;
            case Interest.UFC:
                return ufcProducts;
            case Interest.Wrestling:
                return wrestlingProducts;
            case Interest.F1:
                return f1Products;
            case Interest.TCG:
                return tcgProducts;
            case Interest.Other:
                return otherProducts;
            default:
                return [];
        }
    };

    return (
        <div className="flex flex-col w-full md:w-4/6 md:space-y-4 xl:w-fit">
            {INTERESTS.map(({ label, description, href, icon: Icon, value, color }) => {
                const products = findProducts(value);
                const shouldShow = products.length > 0;
                if (!shouldShow) return null;

                return (
                    <div className="flex flex-col space-y-4" key={`product-row-${label}`}>
                        <div className="flex flex-row">
                            <Link href={href} passHref>
                                <h2 className="text-4xl hover:underline">
                                    {label}
                                    <Icon className={`${iconClassName}`} color={color} />
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
                            <Link href={href} passHref>
                                <button className="btn btn-secondary rounded-md shadow-md w-full">
                                    View all {label}
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
