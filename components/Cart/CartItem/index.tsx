import React from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { decreaseAmount, increaseAmount, removeItem } from '../../../store/slices/cart';

interface BasketItemProps {
    id: number;
    name: string;
    price: number;
    amount: number;
    stock: number;
}

export const CartItem: React.FC<BasketItemProps> = ({ id, name, price, amount, stock }) => {
    const dispatch = useDispatch();

    const handleDecreaseAmount = () => {
        dispatch(decreaseAmount(id));
    };

    const handleIncreaseAmount = () => {
        dispatch(increaseAmount({ id, stock }));
    };

    const handleRemoveItem = () => {
        dispatch(removeItem(id));
    };

    return (
        <tr>
            <td align="center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </button>
            </td>
            <td align="center">{name}</td>
            <td align="center">&pound;{price.toFixed(2)}</td>
            <td align="center">
                <button aria-label="subtract one item" onClick={handleDecreaseAmount}>
                    <MdRemoveCircleOutline />
                </button>
                {amount}
                <button aria-label="add one item" onClick={handleIncreaseAmount}>
                    <MdAddCircleOutline />
                </button>
            </td>
            <td align="center">&pound;{`${(price * amount).toFixed(2)}`}</td>
        </tr>
    );
};

export default CartItem;
