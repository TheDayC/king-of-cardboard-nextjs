import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GiCrownCoin } from 'react-icons/gi';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import selector from './selector';
import { fetchCoins } from '../../../store/slices/account';
import { parseAsString, safelyParse } from '../../../utils/parsers';

interface RewardsProps {
    fullWidth: boolean;
}

export const Rewards: React.FC<RewardsProps> = ({ fullWidth }) => {
    const { coins } = useSelector(selector);
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const userId = safelyParse(session, 'user.id', parseAsString, null);

    useEffect(() => {
        if (userId) {
            dispatch(fetchCoins(userId));
        }
    }, [userId, dispatch]);

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
