import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { getGiftCardBalance } from '../../../utils/achievements';
import { setShouldFetchRewards } from '../../../store/slices/account';
import { setBalance } from '../../../store/slices/account';
import { isArrayOfErrors, isError } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';

interface RewardsProps {
    emailAddress: string | null;
    fullWidth: boolean;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress, fullWidth }) => {
    const { accessToken, shouldFetchRewards, balance } = useSelector(selector);
    const dispatch = useDispatch();

    const fetchBalance = async (token: string, email: string) => {
        const res = await getGiftCardBalance(token, email);

        if (isArrayOfErrors(res)) {
            res.forEach((err) => {
                dispatch(addAlert({ message: err.description, level: AlertLevel.Error }));
            });
        } else {
            dispatch(setBalance(res));
        }
    };

    useEffect(() => {
        if (shouldFetchRewards && accessToken && emailAddress) {
            fetchBalance(accessToken, emailAddress);
            dispatch(setShouldFetchRewards(false));
        }
    }, [accessToken, emailAddress, shouldFetchRewards]);

    return (
        <Link href="/account/achievements" passHref>
            <div
                className={`flex justify-center items-center indicator cursor-pointer rounded-md p-2 hover:bg-neutral-focus${
                    fullWidth ? ' w-full' : ''
                }`}
            >
                <p>{balance} coins</p>
                <GiCrownCoin className="text-primary text-3xl ml-2" />
            </div>
        </Link>
    );
};

export default Rewards;
