import React, { useState } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { fetchOrder, setUpdatingCart } from '../../../store/slices/cart';
import { addError } from '../../../store/slices/errors';
import { removeLineItem, updateLineItem } from '../../../utils/commerce';
import selector from './selector';
import styles from './cartitem.module.css';

interface BasketItemProps {
    id: string;
    sku: string | null;
    name: string | null;
    image_url: string | null;
    unitAmount: string | null;
    totalAmount: string | null;
    quantity: number | null;
}

export const CartItem: React.FC<BasketItemProps> = ({
    id,
    sku,
    name,
    image_url,
    unitAmount,
    totalAmount,
    quantity,
}) => {
    const { products, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const currentProduct = products && products.find((c) => c.sku === sku);
    const [isIncreaseDisabled, setIsIncreaseDisabled] = useState(false);

    const handleDecreaseAmount = async () => {
        if (accessToken && id && quantity && currentProduct) {
            const newQuantity = (quantity -= 1);
            setIsIncreaseDisabled(false);

            if (newQuantity > 0) {
                dispatch(setUpdatingCart(true));
                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            } else {
                handleRemoveItem();
            }
        }
    };

    const handleIncreaseAmount = async () => {
        if (isIncreaseDisabled) {
            return;
        }

        if (accessToken && id && quantity && currentProduct) {
            const newQuantity = (quantity += 1);

            if (newQuantity <= currentProduct.stock) {
                dispatch(setUpdatingCart(true));
                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            }

            if (newQuantity === currentProduct.stock) {
                setIsIncreaseDisabled(true);
            } else {
                setIsIncreaseDisabled(false);
            }
        }
    };

    const handleRemoveItem = async () => {
        if (accessToken && id) {
            dispatch(setUpdatingCart(true));
            const hasDeleted = await removeLineItem(accessToken, id);

            if (hasDeleted) {
                dispatch(fetchOrder(true));
            }
        }
    };

    return (
        <tr>
            <td className="text-center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </button>
            </td>
            <td className="text-center">
                <div className="flex flex-row justify-center items-center space-x-4">
                    {image_url && (
                        <div className={`${styles.imageContainer}`}>
                            <Image src={image_url} alt="shipment image" layout="fill" objectFit="scale-down" />
                        </div>
                    )}
                    <div className="text-left">
                        <h4 className="text-md">{name || ''}</h4>
                        <p className="text-xs text-base-200">{sku || ''}</p>
                    </div>
                </div>
            </td>
            <td className="text-center">{unitAmount}</td>
            <td className="text-center">
                <button
                    aria-label="subtract one item"
                    onClick={handleDecreaseAmount}
                    className={`btn btn-xs btn-secondary btn-circle`}
                >
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                    aria-label="add one item"
                    onClick={handleIncreaseAmount}
                    className={`btn btn-xs btn-circle${isIncreaseDisabled ? ' btn-disabled' : ' btn-secondary'}`}
                >
                    <MdAddCircleOutline />
                </button>
            </td>
            <td className="text-center">{totalAmount}</td>
        </tr>
    );
};

export default CartItem;
