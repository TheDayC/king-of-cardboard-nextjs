import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { getGiftCardBalance } from '../../../utils/achievements';
import { setShouldFetchRewards } from '../../../store/slices/global';

interface RewardsProps {
    emailAddress: string | null;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress }) => {
    const { accessToken, shouldFetchRewards } = useSelector(selector);
    const dispatch = useDispatch();
    const [balance, setBalance] = useState(0);

    const fetchBalance = async (token: string, email: string) => {
        const balanceResponse = await getGiftCardBalance(token, email);

        if (balanceResponse) {
            setBalance(balanceResponse);
        }
    };

    useEffect(() => {
        if (shouldFetchRewards && accessToken && emailAddress) {
            fetchBalance(accessToken, emailAddress);
            dispatch(setShouldFetchRewards(false));
        }
    }, [accessToken, emailAddress]);

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
