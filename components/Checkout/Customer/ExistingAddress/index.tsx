import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { setCheckoutLoading } from '../../../../store/slices/global';
import Address from './Address';
import selector from './selector';
import Loading from '../../../Loading';
import { fetchAddresses } from '../../../../store/slices/account';

interface ExistingAddressProps {
    isShipping: boolean;
}

const ExistingAddress: React.FC<ExistingAddressProps> = ({ isShipping }) => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const { accessToken, checkoutLoading, addresses } = useSelector(selector);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);

    useEffect(() => {
        if (session && shouldFetchAddresses && accessToken && emailAddress) {
            setShouldFetchAddresses(false);
            dispatch(setCheckoutLoading(true));
            dispatch(fetchAddresses({ accessToken, emailAddress }));
            dispatch(setCheckoutLoading(false));
        }
    }, [session, accessToken, emailAddress, shouldFetchAddresses, dispatch]);

    return (
        <div className="w-full block relative">
            <Loading show={checkoutLoading} />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 relative">
                {addresses.length > 0 &&
                    addresses.map((address) => {
                        const { name, full_address, addressId } = address;

                        return (
                            <Address
                                id={addressId}
                                name={name}
                                full_address={full_address}
                                isShipping={isShipping}
                                key={`address-${addressId}`}
                            />
                        );
                    })}
            </div>
        </div>
    );
};

export default ExistingAddress;
