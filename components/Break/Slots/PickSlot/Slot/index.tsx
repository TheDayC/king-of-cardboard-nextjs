import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';

import { removeLineItem, setLineItem } from '../../../../../utils/commerce';
import selector from './selector';
import { fetchCartItems, fetchItemCount } from '../../../../../store/slices/cart';
import { ImageItem } from '../../../../../types/products';
import { addError, addSuccess } from '../../../../../store/slices/alerts';

interface SlotProps {
    image: ImageItem;
    sku_code: string;
    name: string;
    amount: string;
    compare_amount: string;
    isAvailable: boolean;
    setLoading(isLoading: boolean): void;
}

export const Slot: React.FC<SlotProps> = ({
    image,
    sku_code,
    name,
    amount,
    compare_amount,
    isAvailable,
    setLoading,
}) => {
    const { accessToken, orderId, items } = useSelector(selector);
    const dispatch = useDispatch();
    const shouldShowCompare = amount !== compare_amount && compare_amount !== '£0.00';
    const item = items.find((item) => item.sku_code === sku_code);
    const isInBasket = Boolean(item);

    const handleClick = async () => {
        if (!accessToken || !orderId || isInBasket || !isAvailable) return;

        setLoading(true);
        const attributes = {
            quantity: 1,
            sku_code,
            _external_price: false,
            _update_quantity: true,
            image_url: image.url,
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
            dispatch(addSuccess(`${name} added to your cart!`));
            dispatch(fetchItemCount({ accessToken, orderId }));
            dispatch(fetchCartItems({ accessToken, orderId }));
        } else {
            dispatch(addError(`${name} couldn't be added to your cart.`));
        }
    };

    const handleRemove = async () => {
        if (!accessToken || !item || !orderId) return;

        setLoading(true);
        const hasDeleted = await removeLineItem(accessToken, item.id);

        if (hasDeleted) {
            dispatch(fetchItemCount({ accessToken, orderId }));
            dispatch(fetchCartItems({ accessToken, orderId }));
            dispatch(addSuccess(`${name} removed from your cart!`));
        } else {
            dispatch(addError(`${name} couldn't be removed from your cart.`));
        }

        setLoading(false);
    };

    useEffect(() => {
        if (isInBasket) {
            setLoading(false);
        }
    }, [isInBasket, setLoading]);

    return (
        <div
            className={`flex flex-col justify-center items-center p-2 rounded-sm relative${
                isInBasket || !isAvailable ? '' : ' cursor-pointer'
            }`}
            onClick={handleClick}
        >
            {!isAvailable && (
                <div className="absolute inset-0 z-20 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-sm">
                    <p className="text-3xl font-semibold">Sold!</p>
                </div>
            )}
            {isInBasket && (
                <div className="absolute inset-0 z-20 bg-white bg-opacity-95 flex flex-col justify-center items-center rounded-sm">
                    <AiFillCloseCircle
                        className="w-7 h-7 text-red-600 mb-4 absolute top-0 right-0 cursor-pointer hover:text-red-700"
                        onClick={handleRemove}
                    />
                    <AiOutlineShoppingCart className="w-20 h-20 text-green-600" />
                    {/* <p className="text-2xl font-semibold">Added to Cart</p> */}
                </div>
            )}
            {image.url.length > 0 && (
                <div className="w-full h-10 md:h-20 lg:h-32 relative mb-2">
                    <Image
                        src={image.url}
                        alt={image.description}
                        title={image.title}
                        layout="fill"
                        objectFit="scale-down"
                        className="z-10"
                    />
                </div>
            )}
            <p className="text-xs text-center mb-2 lg:mb-4 lg:text-md">{name}</p>
            <div className="flex flex-row justify-center items-center">
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-1">{compare_amount}</span>
                )}
                <p className="text-md lg:text-xl font-semibold">{amount}</p>
            </div>
        </div>
    );
};

export default Slot;
