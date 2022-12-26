import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Loading from '../../Loading';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Add from './Add';
import DisplayAddress from './DisplayAddress';
import { fetchAddresses } from '../../../store/slices/account';

const LIMIT = 10;
const SKIP = 0;

export const AddressBook: React.FC = () => {
    const { addresses } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (userId) {
            //setShouldFetchAddresses(false);
            setIsLoading(true);
            dispatch(fetchAddresses({ userId, limit: LIMIT, skip: SKIP }));
            setIsLoading(false);
        }
    }, [dispatch, userId]);

    return (
        <div className="flex flex-col relative w-full">
            <Loading show={isLoading} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {addresses.length > 0 &&
                    addresses.map(({ _id, title, created, lastUpdated, ...address }) => (
                        <DisplayAddress
                            id={_id}
                            name={title}
                            address={address}
                            key={`address-${_id}`}
                            fetchAddresses={setShouldFetchAddresses}
                        />
                    ))}
                <Add />
            </div>
        </div>
    );
};

export default AddressBook;
