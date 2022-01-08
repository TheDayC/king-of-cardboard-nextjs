import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { fetchGiftCard } from '../../../store/slices/account';

interface RewardsProps {
    emailAddress: string | null;
    fullWidth: boolean;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress, fullWidth }) => {
    const { accessToken, balance } = useSelector(selector);
    const dispatch = useDispatch();
    const [shouldFetch, setShouldFetch] = useState(true);

    useEffect(() => {
        if (shouldFetch && accessToken && emailAddress) {
            setShouldFetch(false);
            dispatch(fetchGiftCard({ accessToken, emailAddress }));
        }
    }, [accessToken, emailAddress, shouldFetch, dispatch]);

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
