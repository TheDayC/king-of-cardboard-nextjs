import React from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { decreaseAmount, increaseAmount, removeItem } from '../../../store/slices/cart';

interface BasketItemProps {
    id: string;
    sku: string;
    name: string;
    price: number;
    quantity: number;
    stock: number;
}

export const CartItem: React.FC<BasketItemProps> = ({ id, name, price, quantity, stock }) => {
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
            <td className="text-center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </button>
            </td>
            <td className="text-center">{name}</td>
            <td className="text-center">&pound;{price.toFixed(2)}</td>
            <td className="text-center">
                <button aria-label="subtract one item" onClick={handleDecreaseAmount}>
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-4">{quantity}</span>
                <button aria-label="add one item" onClick={handleIncreaseAmount}>
                    <MdAddCircleOutline />
                </button>
            </td>
            <td className="text-center">&pound;{`${(price * quantity).toFixed(2)}`}</td>
        </tr>
    );
};

export default CartItem;
