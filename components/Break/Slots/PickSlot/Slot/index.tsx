import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineShoppingCart, AiFillCloseCircle } from 'react-icons/ai';
import { GiCardRandom } from 'react-icons/gi';

import { removeLineItem, setLineItem } from '../../../../../utils/commerce';
import selector from './selector';
//import { fetchCartItems, fetchItemCount } from '../../../../../store/slices/cart';
import { ImageItem } from '../../../../../types/contentful';
import { addError, addSuccess } from '../../../../../store/slices/alerts';
import styles from './slot.module.css';

interface SlotProps {
    image: ImageItem;
    sku_code: string;
    name: string;
    amount: string;
    compare_amount: string;
    isAvailable: boolean;
    isRandom: boolean;
    setLoading(isLoading: boolean): void;
}

export const Slot: React.FC<SlotProps> = ({
    image,
    sku_code,
    name,
    amount,
    compare_amount,
    isAvailable,
    isRandom,
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
            //dispatch(fetchItemCount({ accessToken, orderId }));
            //dispatch(fetchCartItems({ accessToken, orderId }));
        } else {
            dispatch(addError(`${name} couldn't be added to your cart.`));
        }
    };

    const handleRemove = async () => {
        if (!accessToken || !item || !orderId) return;

        setLoading(true);
        const hasDeleted = await removeLineItem(accessToken, item.id);

        if (hasDeleted) {
            // dispatch(fetchItemCount({ accessToken, orderId }));
            //dispatch(fetchCartItems({ accessToken, orderId }));
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
                </div>
            )}

            <div className="flex flex-row justify-center items-center w-full h-24 xl:h-32 relative mb-4">
                {image.url.length > 0 && !isRandom && (
                    <img
                        src={`${image.url}?h=128`}
                        alt={image.description}
                        title={image.title}
                        className={`z-10 w-auto h-full ${styles.logo}`}
                    />
                )}
                {isRandom && <GiCardRandom className="w-32 h-32 text-secondary" />}
            </div>
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
