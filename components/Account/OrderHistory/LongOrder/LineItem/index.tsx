import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface OrderProps {
    name: string;
    slug: string;
    skuCode: string;
    imageUrl: string;
    quantity: number;
    amount: string;
}

export const LineItem: React.FC<OrderProps> = ({ name, slug, skuCode, imageUrl, quantity, amount }) => {
    return (
        <div className="flex flex-row w-full justify-between items-center">
            <div className="relative w-20 h-20">
                {imageUrl && (
                    <Link href={`/product/${slug}`} passHref>
                        <div className="overflow-hidden rounded-md">
                            <Image
                                src={imageUrl}
                                alt={`${name} line item image`}
                                title={`${name} image`}
                                width={80}
                                height={80}
                            />
                        </div>
                    </Link>
                )}
            </div>
            <div className="flex flex-col space-y-2 items-center">
                <Link href={`/product/${slug}`} passHref>
                    <h4 className="text-2xl hover:underline">{name}</h4>
                </Link>
                <p className="text-md text-gray-400">SKU: {skuCode}</p>
                <p className="text-md text-gray-400">Quantity: {quantity}</p>
            </div>
            <p className="text-2xl font-semibold">{amount}</p>
        </div>
    );
};

export default LineItem;
