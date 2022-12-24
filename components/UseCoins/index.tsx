import React from 'react';
import { GiCrownCoin } from 'react-icons/gi';
import { useDispatch, useSelector } from 'react-redux';

import { fetchCartTotals, setUpdatingCart, setShouldUseCoins } from '../../store/slices/cart';
import { setCheckoutLoading } from '../../store/slices/global';
import selector from './selector';

export const UseCoins: React.FC = () => {
    const dispatch = useDispatch();
    const { shouldUseCoins } = useSelector(selector);

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        dispatch(setUpdatingCart(true));
        dispatch(setCheckoutLoading(true));

        dispatch(setShouldUseCoins(checked));
        dispatch(fetchCartTotals());

        dispatch(setUpdatingCart(false));
        dispatch(setCheckoutLoading(false));
    };

    return (
        <div className="flex flex-col w-full items-end">
            <div className="form-control w-auto">
                <label className="cursor-pointer label">
                    <span className="label-text text-lg">
                        <GiCrownCoin className="text-primary text-3xl mr-2 inline-block" /> Spend your coins?
                    </span>
                    <input
                        type="checkbox"
                        className="checkbox checkbox-accent ml-2"
                        onChange={handleOnChange}
                        defaultChecked={shouldUseCoins}
                    />
                </label>
            </div>
        </div>
    );
};

export default UseCoins;
