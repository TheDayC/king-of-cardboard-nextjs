import React, { useCallback } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { setShouldUpdateCart, setUpdatingCart } from '../../../store/slices/cart';
import { removeLineItem, updateLineItem } from '../../../utils/commerce';
import { ImageItem } from '../../../types/products';
import selector from './selector';
import styles from './cartitem.module.css';
import { addError } from '../../../store/slices/alerts';

interface BasketItemProps {
    id: string;
    sku: string;
    name: string;
    image: ImageItem;
    unitAmount: string;
    totalAmount: string;
    quantity: number;
    stock: number;
}

export const CartItem: React.FC<BasketItemProps> = ({
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

    const handleDecreaseAmount = useCallback(async () => {
        if (!accessToken || !id) return;

        const newQuantity = quantity - 1;

        if (newQuantity > 0) {
            // If the quantity is still above zero then add load blocker and update line item.
            dispatch(setUpdatingCart(true));
            const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

            if (hasLineItemUpdated) {
                dispatch(setShouldUpdateCart(true));
            } else {
                dispatch(setUpdatingCart(false));
            }
        } else {
            // If the new quantity is zero or less remove the item from the cart.
            handleRemoveItem();
        }
    }, [accessToken, id, quantity, dispatch, handleRemoveItem]);

    const handleIncreaseAmount = useCallback(async () => {
        if (!accessToken || !id) return;

        const newQuantity = quantity + 1;

        // If we're not allowed to increase anymore then just return.
        if (newQuantity >= stock) {
            return;
        }

        // If the new qty is still within stock levles then update the line item.
        dispatch(setUpdatingCart(true));

        const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

        if (hasLineItemUpdated) {
            dispatch(setShouldUpdateCart(true));
        } else {
            dispatch(setUpdatingCart(false));
        }
    }, [accessToken, id, quantity, stock, dispatch]);

    return (
        <div className="grid grid-cols-3 lg:grid-cols-5 bg-white p-4 border-b p-4">
            <div className="text-center hidden lg:table-cell">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
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
            <div className="text-center hidden lg:table-cell">{unitAmount}</div>
            <div className="text-center">
                <button
                    aria-label="subtract one item"
                    onClick={handleDecreaseAmount}
                    className={`btn btn-xs btn-secondary btn-circle`}
                >
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-2 lg:px-4">{quantity}</span>
                <button
                    aria-label="add one item"
                    onClick={handleIncreaseAmount}
                    className={`btn btn-xs btn-circle${quantity >= stock ? ' btn-disabled' : ' btn-secondary'}`}
                >
                    <MdAddCircleOutline />
                </button>
            </div>
            <div className="text-center">{totalAmount}</div>
        </div>
    );
};

export default CartItem;
