import { DateTime } from 'luxon';
import React from 'react';
import { BsBoxSeam, BsCalendarDate, BsCart, BsQuestionCircle, BsQuestionCircleFill } from 'react-icons/bs';

interface DetailsProps {
    name: string;
    price: string;
    salePrice: string;
    isAvailable: boolean;
    quantity: number;
    tags: string[];
    description: string | null;
    shouldShowCompare: boolean;
    releaseDate: string | null;
}

export const Details: React.FC<DetailsProps> = ({
    name,
    price,
    salePrice,
    isAvailable,
    quantity,
    tags,
    description,
    shouldShowCompare,
    releaseDate,
}) => {
    return (
        <div className="flex flex-col items-center relative w-full space-y-4 md:items-start">
            <h1 className="card-title text-4xl">{name}</h1>
            <div className="flex flex-row">
                {shouldShowCompare && <span className="text-xs line-through text-base-200 mr-2 mt-2">{salePrice}</span>}
                <p className="text-3xl font-semibold">{price}</p>
            </div>
            <div className="flex flex-col items-start space-y-2">
                <p className="text-base-400 text-xl">
                    <BsCart className="inline mr-2 -mt-1" />
                    <span className="font-semibold">Status:</span>{' '}
                    {isAvailable ? (
                        <span className="text-green-600">In Stock</span>
                    ) : (
                        <span className="text-red-600">Out of Stock</span>
                    )}
                </p>
                <p className="text-base-400 text-xl">
                    <BsBoxSeam className="text-xl inline mr-2 -mt-1 text-amber-900" />
                    <span className="font-semibold">Stock:</span> {quantity}
                </p>
                {releaseDate && (
                    <p
                        className="text-base-400 tooltip tooltip-bottom text-xl"
                        data-tip="This is the expected date of release, King of Cardboard assumes no guarantee of this release date."
                    >
                        <BsCalendarDate className="text-xl inline text-secondary-focus mr-2 -mt-1" />
                        <span className="font-semibold">Expected release date:</span>{' '}
                        {DateTime.fromISO(releaseDate).toFormat('dd/MM/yyyy')}
                    </p>
                )}
            </div>
            <div className="flex flex-row flex-wrap justify-start items-center space-x-2">
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
