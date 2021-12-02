import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Achievements from '../../../services/achievments';
import { Achievement, Objective as ObjectiveType } from '../../../types/achievements';
import Loading from '../../Loading';
import Objective from './Objective';
import { getAddresses } from '../../../utils/account';
import { parseAsString, safelyParse } from '../../../utils/parsers';

export const AddressBook: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [addresses, setAddresses] = useState<ObjectiveType[] | null>(null);
    const [achievements, setAchievements] = useState<Achievement[] | null>(null);
    const [page, setPage] = useState(0);
    const [count, setCount] = useState(0);

    const fetchAddresses = async (token: string, email: string) => {
        const addressData = await getAddresses(token, email, 20, 1);
        console.log('🚀 ~ file: index.tsx ~ line 25 ~ fetchAddresses ~ addressData', addressData);
    };

    // Fetch achievements
    useEffect(() => {
        if (shouldFetchAddresses && accessToken && emailAddress) {
            fetchAddresses(accessToken, emailAddress);
            setShouldFetchAddresses(false);
        }
    }, [accessToken, emailAddress, shouldFetchAddresses]);

    return (
        <div className="grid grid-cols-3 relative">
            <Loading show={!addresses} />
        </div>
    );
};

export default AddressBook;
