import React, { useContext } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import AuthProviderContext from '../../../context/context';
import { decreaseAmount, increaseAmount, removeItem } from '../../../store/slices/cart';

interface BasketItemProps {
    id: string;
    sku: string | null;
    name: string | null;
    unitAmount: number | null;
    totalAmount: number | null;
    quantity: number | null;
    stock: number | null;
}

export const CartItem: React.FC<BasketItemProps> = ({ id, name, price, quantity, stock }) => {
    console.log('🚀 ~ file: index.tsx ~ line 18 ~ id', id);
    const cl = useContext(AuthProviderContext);
    const dispatch = useDispatch();

    const handleDecreaseAmount = () => {
        dispatch(decreaseAmount(id));
    };

    const handleIncreaseAmount = () => {
        dispatch(increaseAmount({ id, stock }));
    };

    const handleRemoveItem = () => {
        if (cl) {
            cl.line_items.delete(id);
        }
        // dispatch(removeItem(id));
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
