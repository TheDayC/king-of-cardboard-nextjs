import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { AiOutlineShoppingCart } from 'react-icons/ai';

import { SkuItem } from '../../../../../types/commerce';
import { getSkuDetails, setLineItem } from '../../../../../utils/commerce';
import selector from './selector';
import { BreakSlotWithSku } from '../../../../../types/breaks';
import { fetchOrder } from '../../../../../store/slices/cart';

interface TeamProps {
    skuItem: BreakSlotWithSku;
    setLoading(isLoading: boolean): void;
}

export const Team: React.FC<TeamProps> = ({ skuItem, setLoading }) => {
    const { accessToken, order, items } = useSelector(selector);
    const dispatch = useDispatch();
    const fetchAndMergeSkuDetails = useCallback(async (token: string, id: string) => {
        const skuDetails = await getSkuDetails(token, id);
    }, []);
    const shouldShowCompare = skuItem.amount !== skuItem.compare_amount;
    const isInBasket = Boolean(items.find((item) => item.sku_code === skuItem.sku_code));

    useEffect(() => {
        if (accessToken && skuItem.id) {
            fetchAndMergeSkuDetails(accessToken, skuItem.id);
        }
    }, [accessToken, skuItem.id]);

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

            if (hasLineItemUpdated) {
                setLoading(false);
                dispatch(fetchOrder(true));
            }
        }
    };

    return (
        <div
            className={`flex flex-col justify-center items-center relative${isInBasket ? '' : ' cursor-pointer'}`}
            onClick={handleClick}
        >
            {isInBasket && (
                <div className="absolute inset-0 z-50 bg-base-200 bg-opacity-25 flex flex-col justify-center items-center">
                    <AiOutlineShoppingCart className="w-10 h-10" />
                    <p className="text-xl">In Cart</p>
                </div>
            )}
            {skuItem.image && skuItem.image.url && (
                <div className={`w-32 h-32 relative`}>
                    <Image
                        src={skuItem.image.url}
                        alt="shipment image"
                        layout="fill"
                        objectFit="scale-down"
                        className={`z-40${isInBasket ? ' opacity-10' : ''}`}
                    />
                </div>
            )}
            <p className={`${isInBasket ? ' opacity-10' : ''}`}>{skuItem.name}</p>
            <div className={`flex flex-row justify-center items-center${isInBasket ? ' opacity-10' : ''}`}>
                {shouldShowCompare && (
                    <span className="text-xs line-through text-base-200 mr-2 mt-1">{skuItem.compare_amount}</span>
                )}
                <p className="text-xl font-semibold">{skuItem.amount}</p>
            </div>
        </div>
    );
};

export default Team;
