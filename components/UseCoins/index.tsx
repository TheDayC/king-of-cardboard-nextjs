import React from 'react';
import { GiCrownCoin } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCartTotals, setOrderHasGiftCard, setUpdatingCart } from '../../store/slices/cart';
import { setCheckoutLoading } from '../../store/slices/global';
import { updateGiftCardCode } from '../../utils/checkout';
import selector from './selector';

export const UseCoins: React.FC = () => {
    const { accessToken, orderId, code, orderHasGiftCard } = useSelector(selector);
    const dispatch = useDispatch();

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const codeToSend = checked ? code : '';

        if (!accessToken || !orderId) return;

        dispatch(setUpdatingCart(true));
        dispatch(setCheckoutLoading(true));

        await updateGiftCardCode(accessToken, orderId, codeToSend);
        //dispatch(fetchCartTotals({ accessToken, orderId }));
        dispatch(setOrderHasGiftCard(checked));

        dispatch(setUpdatingCart(false));
        dispatch(setCheckoutLoading(false));
    };

    return (
        <div className="flex flex-col w-full">
            <div className="form-control w-full">
                <label className="cursor-pointer label">
                    <span className="label-text text-lg">
                        <GiCrownCoin className="text-primary text-3xl mr-2 inline-block" /> Spend your coins?
                    </span>
                    <input
                        type="checkbox"
                        className="checkbox"
                        defaultChecked={orderHasGiftCard}
                        onChange={handleOnChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default UseCoins;
