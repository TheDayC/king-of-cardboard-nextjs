import { isNumber } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import AuthProviderContext from '../../../context/context';
import { decreaseAmount, fetchOrder, increaseAmount, removeItem } from '../../../store/slices/cart';
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
    const { order, products } = useSelector(selector);
    const cl = useContext(AuthProviderContext);
    const dispatch = useDispatch();
    const [stock, setStock] = useState(0);

    const currentProduct = products && products.find((c) => c.sku === sku);

    const matchingStockLineItem = useCallback(async () => {
        if (cl && currentProduct) {
            const stockItem = await cl.stock_items.retrieve(currentProduct.id);

            if (isNumber(stockItem.quantity)) {
                setStock(stockItem.quantity);
            }
        }
    }, [cl, currentProduct]);

    useEffect(() => {
        matchingStockLineItem();
    }, [matchingStockLineItem]);

    const handleDecreaseAmount = () => {
        if (cl && quantity && quantity > 1) {
            cl.line_items.update({ id, quantity: (quantity -= 1) }).then(() => {
                matchingStockLineItem();
                dispatch(fetchOrder(true));
            });
        }
    };

    const handleIncreaseAmount = () => {
        if (cl && quantity && quantity < stock) {
            cl.line_items.update({ id, quantity: (quantity += 1) }).then(() => {
                matchingStockLineItem();
                dispatch(fetchOrder(true));
            });
        }
    };

    const handleRemoveItem = () => {
        if (cl) {
            cl.line_items.delete(id).then(() => {
                dispatch(fetchOrder(true));
            });
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
