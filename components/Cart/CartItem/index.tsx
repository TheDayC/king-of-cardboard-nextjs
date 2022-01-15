import React, { useCallback } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import {
    clearUpdateQuantities,
    setShouldUpdateCart,
    setUpdateQuantities,
    setUpdatingCart,
} from '../../../store/slices/cart';
import { removeLineItem } from '../../../utils/commerce';
import { ImageItem } from '../../../types/products';
import selector from './selector';
import styles from './cartitem.module.css';
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
}) => {
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();

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
        <div className="grid grid-cols-3 lg:grid-cols-5 bg-white p-4 border-b p-4">
            <div className="text-error hidden lg:flex lg:flex-row items-center justify-center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever className="text-2xl" />
                </button>
            </div>
            <div className="text-center">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-4">
                    {image.url.length > 0 && (
                        <div className={`mb-2 lg:mb-0 ${styles.imageContainer}`}>
                            <Image
                                src={image.url}
                                alt={image.description}
                                title={image.title}
                                layout="fill"
                                objectFit="scale-down"
                            />
                        </div>
                    )}
                    <div className="text-center lg:text-left">
                        <h4 className="text-xs lg:text-md">{name}</h4>
                        <p className="text-xs text-base-200">{sku || ''}</p>
                    </div>
                </div>
            </div>
            <div className="hidden lg:flex lg:flex-row items-center justify-center">{unitAmount}</div>
            <div className="flex flex-row items-center justify-center">
                <input
                    type="number"
                    defaultValue={quantity}
                    name="quantity"
                    placeholder="1"
                    className="input input-sm input-bordered text-center"
                    onChange={handleChange}
                />
            </div>
            <div className="flex flex-row items-center justify-center">{totalAmount}</div>
        </div>
    );
};

export default CartItem;
