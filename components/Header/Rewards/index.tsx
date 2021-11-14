import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';

import selector from './selector';
import { getGiftCardBalance } from '../../../utils/achievements';

interface RewardsProps {
    emailAddress: string | null;
}

export const Rewards: React.FC<RewardsProps> = ({ emailAddress }) => {
    const { accessToken } = useSelector(selector);
    const [balance, setBalance] = useState(0);

    const fetchBalance = async (token: string, email: string) => {
        const balanceResponse = await getGiftCardBalance(token, email);

        if (balanceResponse) {
            setBalance(balanceResponse);
        }
    };

    useEffect(() => {
        if (accessToken && emailAddress) {
            fetchBalance(accessToken, emailAddress);
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
