import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Loading from '../../Loading';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Add from './Add';
import Address from './Address';
import { fetchAddresses, fetchAddressPageCount } from '../../../store/slices/account';

export const AddressBook: React.FC = () => {
    const { accessToken, userToken, addresses } = useSelector(selector);
    const session = useSession();
    const emailAddress = safelyParse(session, 'data.user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (shouldFetchAddresses && accessToken && emailAddress) {
            setShouldFetchAddresses(false);
            setIsLoading(true);
            dispatch(fetchAddresses(accessToken));
            dispatch(fetchAddressPageCount(accessToken));
            setIsLoading(false);
        }
    }, [dispatch, accessToken, emailAddress, shouldFetchAddresses, userToken]);

    return (
        <div className="flex flex-col relative w-full">
            <Loading show={isLoading} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {addresses.length > 0 &&
                    addresses.map((address) => (
                        <Address
                            id={address.id}
                            name={address.name}
                            full_address={address.full_address}
                            key={`address-${address.id}`}
                            fetchAddresses={setShouldFetchAddresses}
                        />
                    ))}
                <Add />
            </div>
        </div>
    );
};

export default AddressBook;
