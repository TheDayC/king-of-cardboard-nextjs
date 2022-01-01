import React, { useCallback, useEffect, useState } from 'react';
import { MdDeleteForever, MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { isArray } from 'lodash';

import { fetchOrder, setUpdatingCart } from '../../../store/slices/cart';
import { getSkuDetails, removeLineItem, updateLineItem } from '../../../utils/commerce';
import { fetchProductByProductLink } from '../../../utils/products';
import { ContentfulProductShort } from '../../../types/products';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
import selector from './selector';
import styles from './cartitem.module.css';

interface BasketItemProps {
    id: string;
    skuId: string | null;
    sku: string | null;
    name: string | null;
    // image_url: string | null;
    unitAmount: string | null;
    totalAmount: string | null;
    quantity: number | null;
}

export const CartItem: React.FC<BasketItemProps> = ({
    id,
    skuId,
    sku,
    name,
    // image_url,
    unitAmount,
    totalAmount,
    quantity,
}) => {
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();
    const [isIncreaseDisabled, setIsIncreaseDisabled] = useState(false);
    const [stock, setStock] = useState(0);
    const [product, setProduct] = useState<ContentfulProductShort | null>(null);
    const productName = product ? product.name : name;

    const fetchCurrentLineItem = useCallback(
        async (token: string, skuItemId: string, skuCode: string) => {
            const skuItem = await getSkuDetails(token, skuItemId);
            const cmsProduct = await fetchProductByProductLink(skuCode);

            if (cmsProduct && !isArray(cmsProduct)) {
                setProduct(cmsProduct);
            }

            if (isArrayOfErrors(skuItem)) {
                skuItem.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (skuItem && skuItem.inventory) {
                    setStock(skuItem.inventory.quantity);
                }
            }
        },
        [dispatch]
    );

    const handleRemoveItem = useCallback(async () => {
        if (accessToken && id) {
            dispatch(setUpdatingCart(true));
            const hasDeleted = await removeLineItem(accessToken, id);

            if (isArrayOfErrors(hasDeleted)) {
                hasDeleted.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (hasDeleted) {
                    dispatch(fetchOrder(true));
                }
            }
        }
    }, [dispatch, accessToken, id]);

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

                if (isArrayOfErrors(hasLineItemUpdated)) {
                    hasLineItemUpdated.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    if (hasLineItemUpdated) {
                        dispatch(fetchOrder(true));
                    }
                }
            } else {
                // If the new quantity is zero or less remove the item from the cart.
                handleRemoveItem();
            }
        }
    }, [accessToken, id, quantity, dispatch, handleRemoveItem]);

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

                if (isArrayOfErrors(hasLineItemUpdated)) {
                    hasLineItemUpdated.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    if (hasLineItemUpdated) {
                        dispatch(fetchOrder(true));
                    }
                }
            }

            // If it matches the stock level then disable the increase button.
            if (newQuantity === stock) {
                setIsIncreaseDisabled(true);
            }
        }
    }, [accessToken, id, quantity, stock, dispatch, isIncreaseDisabled]);

    useEffect(() => {
        if (accessToken && skuId && sku) {
            fetchCurrentLineItem(accessToken, skuId, sku);
        }
    }, [accessToken, skuId, sku, fetchCurrentLineItem]);

    useEffect(() => {
        if (quantity === stock) {
            setIsIncreaseDisabled(true);
        }
    }, [stock, quantity]);

    return (
        <div className="grid grid-cols-3 lg:grid-cols-5 bg-white p-4 border-b p-4">
            <div className="text-center hidden lg:table-cell">
                <button aria-label="remove item" onClick={handleRemoveItem}>
                    <MdDeleteForever />
                </button>
            </div>
            <div className="text-center">
                <div className="flex flex-col lg:flex-row justify-center items-center lg:space-x-4">
                    {product && product.cardImage && (
                        <div className={`mb-2 lg:mb-0 ${styles.imageContainer}`}>
                            <Image
                                src={product.cardImage.url}
                                alt={product.cardImage.description}
                                title={product.cardImage.title}
                                layout="fill"
                                objectFit="scale-down"
                            />
                        </div>
                    )}
                    <div className="text-center lg:text-left">
                        <h4 className="text-xs lg:text-md">{productName || name}</h4>
                        <p className="text-xs text-base-200">{sku || ''}</p>
                    </div>
                </div>
            </div>
            <div className="text-center hidden lg:table-cell">{unitAmount}</div>
            <div className="text-center">
                <button
                    aria-label="subtract one item"
                    onClick={handleDecreaseAmount}
                    className={`btn btn-xs btn-secondary btn-circle`}
                >
                    <MdRemoveCircleOutline />
                </button>
                <span className="px-2 lg:px-4">{quantity}</span>
                <button
                    aria-label="add one item"
                    onClick={handleIncreaseAmount}
                    className={`btn btn-xs btn-circle${isIncreaseDisabled ? ' btn-disabled' : ' btn-secondary'}`}
                >
                    <MdAddCircleOutline />
                </button>
            </div>
            <div className="text-center">{totalAmount}</div>
        </div>
    );
};

export default CartItem;
