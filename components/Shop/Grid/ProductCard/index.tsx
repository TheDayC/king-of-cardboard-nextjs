import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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

    return (
        <div className="card shadow-md rounded-md bordered pt-4">
            {image.length > 0 && (
                <div className="relative w-full h-40">
                    <Image
                        src={image}
                        alt={imgDesc}
                        title={imgTitle}
                        layout="fill"
                        objectFit="scale-down"
                        className="rounded-sm"
                    />
                </div>
            )}
            <div className="justify-between items-center card-body px-6 py-4">
                <div className="flex flex-col justify-start items-center">
                    <h2 className="card-title text-center text-2xl">{name}</h2>
                    {tags.length > 0 && (
                        <div className="flex flex-row flex-wrap justify-start items-center">
                            {tags.map((tag) => (
                                <div className="badge m-2 badge-secondary badge-outline" key={`tag-${tag}`}>
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
                    <Link
                        href={{
                            pathname: '/product/[slug]',
                            query: { slug },
                        }}
                        passHref
                    >
                        <button className="btn btn-primary btn-sm rounded-md shadow-md w-full">View Product</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
