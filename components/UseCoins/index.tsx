import React from 'react';
import { GiCrownCoin } from 'react-icons/gi';
import { useSelector } from 'react-redux';

import { updateGiftCardCode } from '../../utils/checkout';
import selector from './selector';

export const UseCoins: React.FC = () => {
    const { accessToken, orderId, code } = useSelector(selector);

    const handleOnChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        const codeToSend = checked ? code : '';

        if (!accessToken || !orderId) return;

        await updateGiftCardCode(accessToken, orderId, codeToSend);
    };

    return (
        <div className="flex flex-col w-full">
            <div className="divider lightDivider"></div>
            <div className="form-control w-full">
                <label className="cursor-pointer label">
                    <span className="label-text text-lg">
                        <GiCrownCoin className="text-primary text-3xl mr-2 inline-block" /> Spend your coins?
                    </span>
                    <input type="checkbox" className="checkbox" onChange={handleOnChange} />
                </label>
            </div>
            <div className="divider lightDivider"></div>
        </div>
    );
};

export default UseCoins;
