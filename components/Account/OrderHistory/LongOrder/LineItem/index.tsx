import React from 'react';
import Image from 'next/image';

interface OrderProps {
    name: string;
    skuCode: string;
    imageUrl: string;
    quantity: number;
    amount: string;
}

export const LineItem: React.FC<OrderProps> = ({ name, skuCode, imageUrl, quantity, amount }) => {
    return (
        <div className="flex flex-row w-full">
            <div className="flex flex-row w-full justify-between items-center px-4">
                <div className="relative w-20 h-20">
                    {imageUrl && (
                        <Image
                            src={imageUrl}
                            alt={`${name} line item image`}
                            title={`${name} image`}
                            layout="fill"
                            objectFit="scale-down"
                        />
                    )}
                </div>
                <div>
                    <h4 className="text-md">{name}</h4>
                    <p className="text-xs text-gray-400">{skuCode}</p>
                    <p className="text-xs text-gray-400">Quantity: {quantity}</p>
                </div>
                <p className="text-md">{amount}</p>
            </div>
        </div>
    );
};

export default LineItem;
