import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineShoppingCart } from 'react-icons/ai';

import { setLineItem } from '../../../../../utils/commerce';
import selector from './selector';
import { BreakSlotWithSku } from '../../../../../types/breaks';
import { fetchOrder } from '../../../../../store/slices/cart';
import { isArrayOfErrors } from '../../../../../utils/typeguards';
import { AlertLevel } from '../../../../../enums/system';
import { addAlert } from '../../../../../store/slices/alerts';

interface TeamProps {
    skuItem: BreakSlotWithSku;
    setLoading(isLoading: boolean): void;
}

export const Team: React.FC<TeamProps> = ({ skuItem, setLoading }) => {
    const { accessToken, order, items, shouldFetchOrder } = useSelector(selector);
    const dispatch = useDispatch();
    const shouldShowCompare = skuItem.amount !== skuItem.compare_amount;
    const isInBasket = Boolean(items.find((item) => item.sku_code === skuItem.sku_code));

    const handleClick = async () => {
        if (accessToken && order && !isInBasket) {
            setLoading(true);
            const attributes = {
                quantity: 1,
                sku_code: skuItem.sku_code || '',
                _external_price: false,
                _update_quantity: true,
            };

            const relationships = {
                order: {
                    data: {
                        id: order.id,
                        type: 'orders',
                    },
                },
            };

            const hasLineItemUpdated = await setLineItem(accessToken, attributes, relationships);

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
    };

    useEffect(() => {
        if (!shouldFetchOrder && isInBasket) {
            setLoading(false);
        }
    }, [shouldFetchOrder, isInBasket, setLoading]);

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
            {skuItem.image && skuItem.image.url && (
                <div className="w-full h-10 md:h-20 lg:h-32 relative mb-2">
                    <Image
                        src={skuItem.image.url}
                        alt="shipment image"
                        layout="fill"
                        objectFit="scale-down"
                        className={`z-40${isInBasket ? ' opacity-10' : ''}`}
                    />
                </div>
            )}
            <p className={`text-xs text-center mb-2 lg:mb-4 lg:text-md${isInBasket ? ' opacity-10' : ''}`}>
                {skuItem.name}
            </p>
            <div className={`flex flex-row justify-center items-center${isInBasket ? ' opacity-10' : ''}`}>
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-1">{skuItem.compare_amount}</span>
                )}
                <p className="text-md lg:text-xl font-semibold">{skuItem.amount}</p>
            </div>
        </div>
    );
};

export default Team;
