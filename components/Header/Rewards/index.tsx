import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { fetchCoins, fetchGiftCard } from '../../../store/slices/account';
import { useSession } from 'next-auth/react';

interface RewardsProps {
    emailAddress: string | null;
    fullWidth: boolean;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress, fullWidth }) => {
    const { coins } = useSelector(selector);
    const { data } = useSession();
    const dispatch = useDispatch();

    useEffect(() => {
        if (data) {
            dispatch(fetchCoins(data.user.id));
        }
    }, []);

    return (
        <Link href="/account/achievements" passHref>
            <div
                className={`flex justify-center items-center indicator cursor-pointer rounded-md p-2 hover:bg-neutral-focus${
                    fullWidth ? ' w-full' : ''
                }`}
            >
                <p>{coins} coins</p>
                <GiCrownCoin className="text-primary text-3xl ml-2" />
            </div>
        </Link>
    );
};

export default Rewards;
