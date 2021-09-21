import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { isNumber } from 'lodash';

import { fetchOrder } from '../../../store/slices/cart';
import selector from './selector';
// import { initCommerceClient } from '../../../utils/commerce';
import { Image } from '../../../types/products';
import AuthProviderContext from '../../../context/context';

interface ProductButtonsProps {
    id: string;
    sku: string;
    name: string;
    shortButtons: boolean;
    images: Image[];
}

export const ProductButtons: React.FC<ProductButtonsProps> = ({ id, sku, name, shortButtons, images }) => {
    const dispatch = useDispatch();
    const cl = useContext(AuthProviderContext);
    const { items, order } = useSelector(selector);
    const [stock, setStock] = useState(0);
    const currentProduct = items && items.find((c) => c.sku_code === sku);

    const matchingLineItem = useCallback(async () => {
        if (cl) {
            const stockItem = await cl.stock_items.retrieve(id);

            if (isNumber(stockItem.quantity)) {
                setStock(stockItem.quantity);
            }

            return stockItem;
        }
    }, [cl, id]);

    useEffect(() => {
        matchingLineItem();
    }, [matchingLineItem]);

    const hasExceededStock = Boolean(currentProduct && currentProduct.quantity && currentProduct.quantity >= stock);
    const to = `/product/${id}`;
    const firstImage = images[0];

    const handleOnAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (cl && order) {
            cl.line_items
                .create({
                    sku_code: sku,
                    name,
                    image_url: firstImage.url,
                    quantity: currentProduct && currentProduct.quantity ? (currentProduct.quantity += 1) : 1,
                    _update_quantity: true, // Always update let commerce layer handle whether to create a new line_item or not.
                    order: {
                        id: order.id,
                        type: 'orders',
                    },
                })
                .then(() => {
                    matchingLineItem();
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
