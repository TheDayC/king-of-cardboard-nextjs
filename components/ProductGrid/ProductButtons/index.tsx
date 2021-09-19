import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { addItemToCart, fetchOrder } from '../../../store/slices/cart';
import selector from './selector';
import { initCommerceClient } from '../../../utils/commerce';
import { Image } from '../../../types/products';

interface ProductButtonsProps {
    id: string;
    sku: string;
    name: string;
    stock: number;
    shortButtons: boolean;
    images: Image[];
}

export const ProductButtons: React.FC<ProductButtonsProps> = ({ id, sku, name, stock, shortButtons, images }) => {
    const dispatch = useDispatch();
    const { items, order, accessToken } = useSelector(selector);
    const currentProduct = items.find((c) => c.id === id);
    const hasExceededStock = Boolean(currentProduct && stock && currentProduct.amount >= stock);
    const to = `/product/${id}`;
    const cl = useMemo(() => (accessToken ? initCommerceClient(accessToken) : null), [accessToken]);
    const item = items.find((i) => i.id === id);
    const firstImage = images[0];

    const handleOnAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        // Dispatch an action to add item to cart
        dispatch(addItemToCart({ id, amount: 1 }));
        if (cl && order) {
            cl.line_items
                .create({
                    sku_code: sku,
                    name,
                    image_url: firstImage.url,
                    quantity: item ? (item.amount += 1) : 1,
                    _update_quantity: true, // Always update let commerce layer handle whether to create a new line_item or not.
                    order: {
                        id: order.id,
                        type: 'orders',
                    },
                })
                .then(() => {
                    dispatch(fetchOrder(true));
                });
        }
    };

    return (
        <React.Fragment>
            <Link href={to} passHref>
                <button className="btn btn-outline btn-secondary">{shortButtons ? 'View' : 'View Product'}</button>
            </Link>

            <button className="btn btn-primary" onClick={handleOnAddToCart} disabled={hasExceededStock || stock <= 0}>
                {shortButtons ? 'Add' : 'Add to Cart'}
            </button>
        </React.Fragment>
    );
};

export default ProductButtons;
