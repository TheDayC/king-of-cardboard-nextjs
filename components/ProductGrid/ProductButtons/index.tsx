import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { add } from 'lodash';

import selector from './selector';
import { Image, Product } from '../../../types/products';
import { setLineItem } from '../../../utils/commerce';
import { fetchOrder } from '../../../store/slices/cart';

interface ProductButtonsProps {
    id: string;
    sku: string;
    name: string;
    shortButtons: boolean;
    images: Image[];
}

export const ProductButtons: React.FC<ProductButtonsProps> = ({ id, sku, name, shortButtons, images }) => {
    const dispatch = useDispatch();
    const { items, order, products, accessToken, shouldFetchOrder } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const currentProduct = products.find((c) => c.sku === sku) || null;
    const currentProductLineItem = items.find((c) => c.sku_code === sku) || null;
    const stock = (currentProduct && currentProduct.stock) || 0;

    const hasExceededStock = currentProduct && currentProductLineItem && currentProductLineItem.quantity >= stock;
    const to = `/product/${id}`;
    const firstImage = images[0];

    const updateLineItem = useCallback(
        async (accessToken: string, currentProduct: Product, orderId: string) => {
            if (accessToken && currentProduct && orderId) {
                const attributes = {
                    quantity: 1,
                    sku_code: sku,
                    name,
                    image_url: firstImage.url,
                    _external_price: false,
                    _update_quantity: true,
                };

                const relationships = {
                    order: {
                        data: {
                            id: orderId,
                            type: 'orders',
                        },
                    },
                };

                const hasLineItemUpdated = await setLineItem(accessToken, attributes, relationships);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            }
        },
        [name, firstImage, sku, dispatch]
    );

    const handleOnAddToCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (accessToken && currentProduct && order && !loading) {
            setLoading(true);
            updateLineItem(accessToken, currentProduct, order.id);
        }
    };

    useEffect(() => {
        if (!shouldFetchOrder) {
            setLoading(false);
        }
    }, [shouldFetchOrder]);

    const btnClassNames = `btn btn-primary${loading ? ' loading' : ''}`;
    const btnText = shortButtons ? 'Add' : 'Add to Cart';

    return (
        <React.Fragment>
            <Link href={to} passHref>
                <button className="btn btn-outline btn-secondary">{shortButtons ? 'View' : 'View Product'}</button>
            </Link>

            <button className={btnClassNames} onClick={handleOnAddToCart} disabled={hasExceededStock || stock <= 0}>
                {loading ? '' : btnText}
            </button>
        </React.Fragment>
    );
};

export default ProductButtons;
