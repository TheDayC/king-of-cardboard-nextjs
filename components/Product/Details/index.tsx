import React from 'react';

interface DetailsProps {
    name: string;
    amount: string | null;
    compareAmount: string | null;
    isAvailable: boolean;
    shouldShowCompare: boolean;
    quantity: number;
    tags: string[] | null;
    description: string[] | null;
}

export const Details: React.FC<DetailsProps> = ({
    name,
    amount,
    compareAmount,
    isAvailable,
    shouldShowCompare,
    quantity,
    tags,
    description,
}) => (
    <React.Fragment>
        <h1 className="card-title text-xl lg:text-4xl">{name}</h1>
        <div className="flex flex-row">
            {shouldShowCompare && <span className="text-xs line-through text-base-200 mr-2 mt-1">{compareAmount}</span>}
            <p className="text-xl font-semibold">{amount}</p>
        </div>
        <div className="flex flex-col mb-2">
            <p className="text-base-200 text-sm text-mb-2">
                {isAvailable ? `In Stock - Quantity ${quantity}` : 'Out of Stock'}
            </p>
        </div>
        <div className="flex flex-row flex-wrap justify-start items-center mb-4 space-x-2">
            {tags &&
                tags.map((tag) => (
                    <div className="badge badge-secondary badge-outline" key={`tag-${tag}`}>
                        {tag}
                    </div>
                ))}
        </div>
        {description && (
            <div className="description">
                {description.map((d, i) => (
                    <p className="mb-4" key={`description-${i}`}>
                        {d}
                    </p>
                ))}
            </div>
        )}
    </React.Fragment>
);

export default Details;
