import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import { setLineItem } from '../../../../../utils/commerce';
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
    setLoading(isLoading: boolean): void;
}

export const Slot: React.FC<SlotProps> = ({ image, sku_code, name, amount, compare_amount, setLoading }) => {
    const { accessToken, orderId, items } = useSelector(selector);
    const dispatch = useDispatch();
    const shouldShowCompare = amount !== compare_amount && compare_amount !== '£0.00';
    const isInBasket = Boolean(items.find((item) => item.sku_code === sku_code));

    const handleClick = async () => {
        if (!accessToken || !orderId || isInBasket) return;

        setLoading(true);
        const attributes = {
            quantity: 1,
            sku_code,
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
            dispatch(addSuccess(`${name} added to your cart!`));
            dispatch(fetchItemCount({ accessToken, orderId }));
            dispatch(fetchCartItems({ accessToken, orderId }));
        } else {
            dispatch(addError(`${name} couldn't be added to your cart.`));
        }
    };

    useEffect(() => {
        if (isInBasket) {
            setLoading(false);
        }
    }, [isInBasket, setLoading]);

    return (
        <div
            className={`flex flex-col justify-center items-center p-2 rounded-sm relative${
                isInBasket ? '' : ' cursor-pointer'
            }`}
            onClick={handleClick}
        >
            {isInBasket && (
                <div className="absolute inset-0 z-50 bg-base-200 bg-opacity-25 flex flex-col justify-center items-center rounded-md">
                    <AiOutlineShoppingCart className="w-10 h-10" />

                    <p className="text-xl">In Cart</p>
                </div>
            )}
            {image.url.length > 0 && (
                <div className="w-full h-10 md:h-20 lg:h-32 relative mb-2">
                    <GiPerspectiveDiceSixFacesRandom className="text-3xl absolute top-0 right-0 text-accent" />
                    <Image
                        src={image.url}
                        alt={image.description}
                        title={image.title}
                        layout="fill"
                        objectFit="scale-down"
                        className={`z-40${isInBasket ? ' opacity-10' : ''}`}
                    />
                </div>
            )}
            <p className={`text-xs text-center mb-2 lg:mb-4 lg:text-md${isInBasket ? ' opacity-10' : ''}`}>{name}</p>
            <div className={`flex flex-row justify-center items-center${isInBasket ? ' opacity-10' : ''}`}>
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-1">{compare_amount}</span>
                )}
                <p className="text-md lg:text-xl font-semibold">{amount}</p>
            </div>
        </div>
    );
};

export default Slot;
