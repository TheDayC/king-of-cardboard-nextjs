import { Document } from '@contentful/rich-text-types';
import React from 'react';

import Content from '../../Content';

interface DetailsProps {
    name: string;
    amount: string;
    compareAmount: string;
    isAvailable: boolean;
    quantity: number;
    tags: string[];
    description: Document[] | null;
}

export const Details: React.FC<DetailsProps> = ({
    name,
    amount,
    compareAmount,
    isAvailable,
    quantity,
    tags,
    description,
}) => {
    const shouldShowCompare = amount !== compareAmount && compareAmount.length > 0;

    return (
        <div className="block relative w-full">
            <h1 className="card-title text-xl lg:text-4xl">{name}</h1>
            <div className="flex flex-row">
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-1">{compareAmount}</span>
                )}
                <p className="text-xl font-semibold">{amount}</p>
            </div>
            <div className="flex flex-col mb-2">
                <p className="text-base-200 text-sm text-mb-2">
                    {isAvailable ? `In Stock - Quantity ${quantity}` : 'Out of Stock'}
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
        </div>
    );
};

export default Details;
