import React, { useCallback } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { LineItemOption } from '@commercelayer/sdk';

import {
    clearUpdateQuantities,
    setShouldUpdateCart,
    setUpdateQuantities,
    setUpdatingCart,
} from '../../../store/slices/cart';
import { removeLineItem } from '../../../utils/commerce';
import { ImageItem } from '../../../types/contentful';
import selector from './selector';
import { addError } from '../../../store/slices/alerts';
import { parseAsString, safelyParse } from '../../../utils/parsers';

interface CartItemProps {
    id: string;
    sku: string;
    name: string;
    image: ImageItem;
    unitAmount: string;
    totalAmount: string;
    quantity: number;
    stock: number;
    lineItemOptions: LineItemOption[];
}

export const CartItem: React.FC<CartItemProps> = ({
    id,
    sku,
    name,
    image,
    unitAmount,
    totalAmount,
    quantity,
    stock,
    lineItemOptions,
}) => {
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const isQuantityAtMax = quantity === stock;

    const handleRemoveItem = useCallback(async () => {
        if (!accessToken || !id) return;

        dispatch(setUpdatingCart(true));
        const hasDeleted = await removeLineItem(accessToken, id);

        if (hasDeleted) {
            dispatch(setShouldUpdateCart(true));
        } else {
            dispatch(addError('Could not remove this item.'));
            dispatch(setUpdatingCart(false));
        }
    }, [dispatch, accessToken, id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = safelyParse(e, 'target.value', parseAsString, null);

        if (value) {
            const newQty = parseInt(value, 10);

            if (newQty > stock) {
                dispatch(clearUpdateQuantities());
                return;
            }

            if (newQty !== quantity) {
                dispatch(setUpdateQuantities({ id, quantity: parseInt(value, 10) }));
            }
        }
    };

    return (
        <div className="grid grid-cols-4 lg:grid-cols-6 bg-white p-4 border-b p-4">
            <div className="text-error flex flex-row items-center justify-center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever className="text-3xl" />
                </button>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2">
                <div className="text-error lg:flex lg:flex-row items-center justify-center w-full relative">
                    {image.url.length > 0 && (
                        <div className="w-20 h-20">
                            <Image
                                src={`${image.url}?w=100`}
                                alt={image.description}
                                title={image.title}
                                layout="fill"
                                objectFit="scale-down"
                            />
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center items-center text-center lg:space-x-4">
                    <Link href={`/product/${sku.toLowerCase()}`} passHref>
                        <div className="cursor-pointer">
                            <h4 className="hidden lg:block text-xs mb-1 font-bold lg:text-md hover:underline">
                                {name}
                            </h4>
                            <p className="hidden lg:block text-xs text-gray-400 mb-4">{sku || ''}</p>

                            {lineItemOptions.length > 0 &&
                                lineItemOptions.map((option) => (
                                    <p
                                        className="hidden lg:block text-xs text-gray-400 mb-1"
                                        key={`option-${option.id}`}
                                    >
                                        Addon: {option.name} - {option.formatted_total_amount}
                                    </p>
                                ))}
                        </div>
                    </Link>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-row items-center justify-center">{unitAmount}</div>
            <div className="flex flex-row items-center justify-center">
                {isQuantityAtMax ? (
                    <p className="px-2 w-full text-center">{quantity}</p>
                ) : (
                    <input
                        type="number"
                        defaultValue={quantity}
                        name="quantity"
                        placeholder="1"
                        className="input input-md lg:input-sm input-bordered text-center w-14 px-0"
                        onChange={handleChange}
                        min={1}
                    />
                )}
            </div>
            <div className="flex flex-row items-center justify-center font-semibold text-sm lg:text-md">
                {totalAmount}
            </div>
        </div>
    );
};

export default CartItem;
