import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRightSquareFill } from 'react-icons/bs';

import { Product } from '../../types/products';
import { getPrettyPrice } from '../../utils/account/products';
import Details from '../Product/Details';
import { truncate } from 'lodash';

interface FeaturedProductProps {
    product: Product;
}

export const FeaturedProduct: FC<FeaturedProductProps> = ({ product }) => {
    const linkOptions = {
        pathname: '/product/[slug]',
        query: { slug: product.slug },
    };

    return (
        <div className="flex flex-col w-full max-w-7xl">
            <div
                className="card shadow-md rounded-md p-6 transition duration-300 ease-in-out relative hover:shadow-2xl"
                data-testid="featured-product-card"
            >
                <div className="flex flex-col gap-y-6 lg:flex-row lg:gap-x-6">
                    <div className="flex flex-col gap-y-2">
                        <p className="badge badge-secondary shadow-sm">Featured</p>
                        <h4 className="font-bold text-lg lg:text-3xl">{product.title}</h4>
                        <Details
                            price={getPrettyPrice(product.price)}
                            salePrice={getPrettyPrice(product.salePrice)}
                            isAvailable={product.quantity > 0}
                            quantity={product.quantity}
                            tags={[]}
                            description={truncate(product.content, { length: 400, omission: '...' })}
                            shouldShowCompare={product.salePrice > 0 && product.salePrice !== product.price}
                            releaseDate={product.releaseDate}
                            stockStatus={product.stockStatus}
                        />
                        <Link href={linkOptions} passHref className="w-full">
                            <button className="btn btn-block btn-md btn-primary rounded-md shadow-none">
                                View Product
                                <BsArrowRightSquareFill className="inline w-5 h-5 ml-4 inline lg:hidden xl:inline" />
                            </button>
                        </Link>
                    </div>
                    <div className="flex flex-row justify-center items-start w-full relative h-96 lg:h-auto">
                        <Image
                            src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}${product.mainImage}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            alt={`${product.title} primary image`}
                            title={`${product.title} image`}
                            className="rounded-md shadow-md"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedProduct;
