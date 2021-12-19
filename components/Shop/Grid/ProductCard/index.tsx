import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
    name: string | null;
    image: string | null;
    imgDesc: string;
    imgTitle: string;
    tags: string[] | null;
    shouldShowCompare: boolean;
    amount: string | null;
    compareAmount: string | null;
    slug: string | null;
}

export const ProductCard: React.FC<CardProps> = ({
    name,
    image,
    imgDesc,
    imgTitle,
    tags,
    shouldShowCompare,
    amount,
    compareAmount,
    slug,
}) => {
    return (
        <div className="card shadow-md rounded-md image-full">
            {image && (
                <Image
                    src={image}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                    alt={imgDesc}
                    title={imgTitle}
                />
            )}
            <div className="justify-between items-center card-body px-6 py-4">
                <div className="flex flex-col justify-start items-center">
                    <h2 className="card-title text-center text-2xl">{name}</h2>
                    {tags && tags.length > 0 && (
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
                    <div
                        className={`flex flex-row ${
                            shouldShowCompare ? 'justify-between' : 'justify-end'
                        } items-center w-full`}
                    >
                        {shouldShowCompare && (
                            <span className="text-xs line-through text-base-200 mr-2 mt-1">{compareAmount}</span>
                        )}
                        <span className="text-lg font-bold">{amount}</span>
                    </div>
                    <Link href={`/product/${slug}`} passHref>
                        <button className="btn btn-primary btn-sm rounded-md shadow-md w-full">View Product</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
