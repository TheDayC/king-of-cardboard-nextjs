import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { getGiftCardBalance } from '../../../utils/achievements';
import { setShouldFetchRewards } from '../../../store/slices/account';
import { setBalance } from '../../../store/slices/account';

interface RewardsProps {
    emailAddress: string | null;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress }) => {
    const { accessToken, shouldFetchRewards, balance } = useSelector(selector);
    console.log('🚀 ~ file: index.tsx ~ line 17 ~ shouldFetchRewards', shouldFetchRewards);
    const dispatch = useDispatch();

    const fetchBalance = async (token: string, email: string) => {
        const balanceResponse = await getGiftCardBalance(token, email);

        if (balanceResponse) {
            dispatch(setBalance(balanceResponse));
        }
    };

    useEffect(() => {
        if (shouldFetchRewards && accessToken && emailAddress) {
            console.log('🚀 ~ file: index.tsx ~ line 30 ~ useEffect ~ shouldFetchRewards', shouldFetchRewards);
            fetchBalance(accessToken, emailAddress);
            dispatch(setShouldFetchRewards(false));
        }
    }, [accessToken, emailAddress, shouldFetchRewards]);

    return (
        <Link href="/account/achievements" passHref>
            <div className="flex justify-center items-center indicator cursor-pointer rounded-md p-2 hover:bg-neutral-focus">
                <p>{balance} coins</p>
                <GiCrownCoin className="text-primary text-3xl ml-2" />
            </div>
        </Link>
    );
};

export default Rewards;
