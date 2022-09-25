import { Document } from '@contentful/rich-text-types';
import React from 'react';

import { PriceHistory } from '../../../types/imports';
import Content from '../../Content';
import PriceHistoryChart from '../PriceHistoryChart';

interface DetailsProps {
    name: string;
    amount: string;
    compareAmount: string;
    isAvailable: boolean;
    quantity: number;
    tags: string[];
    description: Document[] | null;
    priceHistory: PriceHistory[];
    hasUnlimitedStock: boolean;
}

export const Details: React.FC<DetailsProps> = ({
    name,
    amount,
    compareAmount,
    isAvailable,
    quantity,
    tags,
    description,
    priceHistory,
    hasUnlimitedStock,
}) => {
    const shouldShowCompare = amount !== compareAmount && compareAmount.length > 0;
    const withStock =
        isAvailable && !hasUnlimitedStock ? (
            <span className="text-green-600">{`In Stock - Quantity ${quantity}`}</span>
        ) : (
            <span className="text-red-600">Out of stock</span>
        );

    return (
        <div className="block relative w-full">
            <h1 className="card-title text-xl lg:text-4xl mb-4">{name}</h1>
            <div className="flex flex-row mb-2">
                {shouldShowCompare && (
                    <span className="text-lg line-through text-red-400 mr-2 mt-2">{compareAmount}</span>
                )}
                <p className="text-3xl font-semibold">{amount}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-base-400 text-mb-2">
                    <span className="font-semibold">Status:</span>{' '}
                    {hasUnlimitedStock ? <span className="text-green-600">In Stock</span> : withStock}
                </p>
            </div>
            <div className="flex flex-row flex-wrap justify-start items-center mb-4 space-x-2">
                {tags.length > 0 &&
                    tags.map((tag) => (
                        <div className="badge badge-secondary" key={`tag-${tag}`}>
                            {tag}
                        </div>
                    ))}
            </div>
            {description && description.length > 0 && (
                <div className="description">{description && <Content content={description} />}</div>
            )}
            <PriceHistoryChart priceHistory={priceHistory} />
        </div>
    );
};

export default Details;
