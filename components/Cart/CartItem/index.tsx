import { isNumber } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import AuthProviderContext from '../../../context/context';
import { decreaseAmount, fetchOrder, increaseAmount, removeItem } from '../../../store/slices/cart';
import { removeLineItem, updateLineItem } from '../../../utils/commerce';
import selector from './selector';

interface BasketItemProps {
    id: string;
    sku: string | null;
    name: string | null;
    unitAmount: string | null;
    totalAmount: string | null;
    quantity: number | null;
}

export const CartItem: React.FC<BasketItemProps> = ({ id, sku, name, unitAmount, totalAmount, quantity }) => {
    const { products, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const currentProduct = products && products.find((c) => c.sku === sku);

    const handleDecreaseAmount = async () => {
        if (accessToken && id && quantity && currentProduct) {
            const newQuantity = (quantity -= 1);

            if (newQuantity > 0) {
                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            }
        }
    };

    const handleIncreaseAmount = async () => {
        if (accessToken && id && quantity && currentProduct) {
            const newQuantity = (quantity += 1);

            if (newQuantity <= currentProduct.stock) {
                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            }
        }
    };

    const handleRemoveItem = async () => {
        if (accessToken && id) {
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
            <td className="text-center">{name}</td>
            <td className="text-center">{unitAmount}</td>
            <td className="text-center">
                <button aria-label="subtract one item" onClick={handleDecreaseAmount}>
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-4">{quantity}</span>
                <button aria-label="add one item" onClick={handleIncreaseAmount}>
                    <MdAddCircleOutline />
                </button>
            </td>
            <td className="text-center">{totalAmount}</td>
        </tr>
    );
};

export default CartItem;
