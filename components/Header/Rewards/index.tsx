import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { setShouldFetchRewards, fetchGiftCard } from '../../../store/slices/account';

interface RewardsProps {
    emailAddress: string | null;
    fullWidth: boolean;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress, fullWidth }) => {
    const { accessToken, shouldFetchRewards, balance } = useSelector(selector);
    const dispatch = useDispatch();

    useEffect(() => {
        if (shouldFetchRewards && accessToken && emailAddress) {
            dispatch(fetchGiftCard({ accessToken, emailAddress }));
            dispatch(setShouldFetchRewards(false));
        }
    }, [accessToken, emailAddress, shouldFetchRewards, dispatch]);

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
