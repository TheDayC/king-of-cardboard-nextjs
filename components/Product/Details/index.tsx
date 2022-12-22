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
    description: string | null;
    shouldShowCompare: boolean;
}

export const Details: React.FC<DetailsProps> = ({
    name,
    amount,
    compareAmount,
    isAvailable,
    quantity,
    tags,
    description,
    shouldShowCompare,
}) => {
    return (
        <div className="block relative w-full">
            <h1 className="card-title text-xl lg:text-4xl mb-4">{name}</h1>
            <div className="flex flex-row mb-2">
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-2">{compareAmount}</span>
                )}
                <p className="text-3xl font-semibold">{amount}</p>
            </div>
            <div className="flex flex-col mb-4">
                <p className="text-base-400 text-mb-2">
                    {isAvailable ? (
                        <React.Fragment>
                            <span className="font-semibold">Status:</span>{' '}
                            <span className="text-green-600">In Stock</span>
                            <br />
                            <span className="font-semibold">Quantity:</span>{' '}
                            <span className="text-base-400">{quantity}</span>
                        </React.Fragment>
                    ) : (
                        <span className="text-red-600">Out of stock</span>
                    )}
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
            {description && <div className="description" dangerouslySetInnerHTML={{ __html: description }} />}
        </div>
    );
};

export default Details;
