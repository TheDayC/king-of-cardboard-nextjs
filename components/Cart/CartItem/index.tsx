import { IconButton, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { fetchOrder } from '../../../store/slices/cart';
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
        <TableRow>
            <TableCell className="text-center">
                <IconButton aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </IconButton>
            </TableCell>
            <TableCell className="text-center">{name}</TableCell>
            <TableCell className="text-center">{unitAmount}</TableCell>
            <TableCell className="text-center">
                <IconButton aria-label="subtract one item" onClick={handleDecreaseAmount}>
                    <MdRemoveCircleOutline />
                </IconButton>
                <span className="px-4">{quantity}</span>
                <IconButton aria-label="add one item" onClick={handleIncreaseAmount}>
                    <MdAddCircleOutline />
                </IconButton>
            </TableCell>
            <TableCell className="text-center">{totalAmount}</TableCell>
        </TableRow>
    );
};

export default CartItem;
