import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addItemToCart } from '../../../store/slices/cart';
import selector from './selector';

interface ProductButtonsProps {
    id: number;
    stock: number;
    shortButtons: boolean;
}

export const ProductButtons: React.FC<ProductButtonsProps> = ({ id, stock, shortButtons }) => {
    const dispatch = useDispatch();
    const { cart } = useSelector(selector);
    const currentProduct = cart.find((c) => c.id === id);
    const hasExceededStock = Boolean(currentProduct && currentProduct.amount >= stock);
    const to = `/product/${id}`;

    const handleOnAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Dispatch an action to add item to cart
        dispatch(addItemToCart({ id, amount: 1 }));
    };

    return (
        <React.Fragment>
            <button className="btn btn-outline btn-secondary">
                <a href={to}>{shortButtons ? 'View' : 'View Product'}</a>
            </button>
            <button className="btn btn-primary" onClick={handleOnAddToCart} disabled={hasExceededStock}>
                {shortButtons ? 'Add' : 'Add to Cart'}
            </button>
        </React.Fragment>
    );
};

export default ProductButtons;
