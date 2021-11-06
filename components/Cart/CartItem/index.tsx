import React, { useCallback, useEffect, useState } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';

import { fetchOrder, setUpdatingCart } from '../../../store/slices/cart';
import { getSkuDetails, getSkus, removeLineItem, updateLineItem } from '../../../utils/commerce';
import selector from './selector';
import styles from './cartitem.module.css';
import { fetchProductByProductLink, mergeSkuProductData } from '../../../utils/products';
import { ContentfulProductShort } from '../../../types/products';
import { isArray } from 'lodash';

interface BasketItemProps {
    id: string;
    skuId: string | null;
    sku: string | null;
    name: string | null;
    image_url: string | null;
    unitAmount: string | null;
    totalAmount: string | null;
    quantity: number | null;
}

export const CartItem: React.FC<BasketItemProps> = ({
    id,
    skuId,
    sku,
    name,
    image_url,
    unitAmount,
    totalAmount,
    quantity,
}) => {
    const { products, accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const [isIncreaseDisabled, setIsIncreaseDisabled] = useState(false);
    const [stock, setStock] = useState(0);
    const [product, setProduct] = useState<ContentfulProductShort | null>(null);
    const productName = product ? product.name : name;

    const fetchCurrentLineItem = async (token: string, skuItemId: string, skuCode: string) => {
        const skuItem = await getSkuDetails(token, skuItemId);
        const cmsProduct = await fetchProductByProductLink(skuCode);

        if (cmsProduct && !isArray(cmsProduct)) {
            setProduct(cmsProduct);
        }

        if (skuItem && skuItem.inventory) {
            setStock(skuItem.inventory.quantity);
        }
    };

    const handleDecreaseAmount = useCallback(async () => {
        // Check if the access token, line item id and quantity are available.
        if (accessToken && id && quantity) {
            // If they are, set a new quantity to check and remove the increase blocker.
            const newQuantity = quantity - 1;
            setIsIncreaseDisabled(false);

            if (newQuantity > 0) {
                // If the quantity is still above zero then add load blocker and update line item.
                dispatch(setUpdatingCart(true));
                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            } else {
                // If the new quantity is zero or less remove the item from the cart.
                handleRemoveItem();
            }
        }
    }, [accessToken, id, quantity]);

    const handleIncreaseAmount = useCallback(async () => {
        // If we're not allowed to increase anymore then just return.
        if (isIncreaseDisabled) {
            return;
        }

        // Check for our 3 required variables + currentProduct for comparison
        if (accessToken && id && quantity && stock) {
            // Create the new quantity for comparison.
            const newQuantity = quantity + 1;

            // If the new qty is still within stock levles then update the line item.
            if (newQuantity <= stock) {
                dispatch(setUpdatingCart(true));
                setIsIncreaseDisabled(false);

                const hasLineItemUpdated = await updateLineItem(accessToken, id, newQuantity);

                if (hasLineItemUpdated) {
                    dispatch(fetchOrder(true));
                }
            }

            // If it matches the stock level then disable the increase button.
            if (newQuantity === stock) {
                setIsIncreaseDisabled(true);
            }
        }
    }, [accessToken, id, quantity, stock]);

    const handleRemoveItem = async () => {
        if (accessToken && id) {
            dispatch(setUpdatingCart(true));
            const hasDeleted = await removeLineItem(accessToken, id);

            if (hasDeleted) {
                dispatch(fetchOrder(true));
            }
        }
    };

    useEffect(() => {
        if (accessToken && skuId && sku) {
            fetchCurrentLineItem(accessToken, skuId, sku);
        }
    }, [accessToken, skuId, sku]);

    useEffect(() => {
        if (quantity === stock) {
            setIsIncreaseDisabled(true);
        }
    }, [stock]);

    return (
        <tr>
            <td className="text-center">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </button>
            </td>
            <td className="text-center">
                <div className="flex flex-row justify-center items-center space-x-4">
                    {product && product.cardImage && (
                        <div className={`${styles.imageContainer}`}>
                            <Image
                                src={product.cardImage.url}
                                alt={product.cardImage.description}
                                title={product.cardImage.title}
                                layout="fill"
                                objectFit="scale-down"
                            />
                        </div>
                    )}
                    <div className="text-left">
                        <h4 className="text-md">{productName || name}</h4>
                        <p className="text-xs text-base-200">{sku || ''}</p>
                    </div>
                </div>
            </td>
            <td className="text-center">{unitAmount}</td>
            <td className="text-center">
                <button
                    aria-label="subtract one item"
                    onClick={handleDecreaseAmount}
                    className={`btn btn-xs btn-secondary btn-circle`}
                >
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                    aria-label="add one item"
                    onClick={handleIncreaseAmount}
                    className={`btn btn-xs btn-circle${isIncreaseDisabled ? ' btn-disabled' : ' btn-secondary'}`}
                >
                    <MdAddCircleOutline />
                </button>
            </td>
            <td className="text-center">{totalAmount}</td>
        </tr>
    );
};

export default CartItem;
