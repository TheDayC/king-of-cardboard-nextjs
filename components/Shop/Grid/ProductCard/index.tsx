import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
    name: string;
    image: string;
    imgDesc: string;
    imgTitle: string;
    tags: string[];
    amount: string;
    compareAmount: string;
    slug: string;
}

export const ProductCard: React.FC<CardProps> = ({
    name,
    image,
    imgDesc,
    imgTitle,
    tags,
    amount,
    compareAmount,
    slug,
}) => {
    const shouldShowCompare = amount !== compareAmount && compareAmount.length > 0;
    const linkOptions = {
        pathname: '/product/[slug]',
        query: { slug },
    };

    return (
        <div
            className="card shadow-md rounded-md bordered pt-4 transition duration-300 ease-in-out hover:shadow-2xl"
            data-testid="product-card"
        >
            {image.length > 0 && (
                <Link href={linkOptions} passHref>
                    <div className="relative w-full h-40 cursor-pointer flex flex-row justify-center">
                        <div className="rounded-md overflow-hidden shadow-md w-40 h-40">
                            <Image
                                src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}${image}`}
                                width={160}
                                height={160}
                                alt={imgDesc}
                                title={imgTitle}
                            />
                        </div>
                    </div>
                </Link>
            )}
            <div className="justify-between items-center card-body px-6 py-4">
                <div className="flex flex-col justify-start items-center">
                    <Link href={linkOptions} passHref>
                        <h2 className="card-title text-center text-2xl cursor-pointer hover:underline">{name}</h2>
                    </Link>
                    {tags.length > 0 && (
                        <div className="flex flex-row flex-wrap justify-start items-center">
                            {tags.map((tag) => (
                                <div className="badge m-2 badge-secondary" key={`tag-${tag}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-actions w-full">
                    <div className="flex flex-row justify-end items-center w-full">
                        {shouldShowCompare && (
                            <span className="text-md line-through text-base-200 mr-2 mt-1">{compareAmount}</span>
                        )}
                        <span className="text-2xl font-bold">{amount}</span>
                    </div>
                    <Link href={linkOptions} passHref className="w-full">
                        <button className="btn btn-primary btn-sm rounded-md shadow-md w-full">View Product</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
