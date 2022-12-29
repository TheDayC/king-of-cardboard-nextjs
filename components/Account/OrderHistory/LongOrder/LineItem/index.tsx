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
        <div className="flex flex-row w-full justify-between items-center">
            <div className="relative w-20 h-20">
                {imageUrl && (
                    <div className="overflow-hidden rounded-md">
                        <Image
                            src={imageUrl}
                            alt={`${name} line item image`}
                            title={`${name} image`}
                            width={80}
                            height={80}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-2 items-center">
                <h4 className="text-2xl">{name}</h4>
                <p className="text-md text-gray-400">SKU: {skuCode}</p>
                <p className="text-md text-gray-400">Quantity: {quantity}</p>
            </div>
            <p className="text-2xl font-semibold">{amount}</p>
        </div>
    );
};

export default LineItem;
