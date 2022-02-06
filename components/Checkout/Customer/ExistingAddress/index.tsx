import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

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
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);

    useEffect(() => {
        if (session && shouldFetchAddresses && accessToken) {
            setShouldFetchAddresses(false);
            dispatch(setCheckoutLoading(true));
            dispatch(fetchAddresses(accessToken));
            dispatch(setCheckoutLoading(false));
        }
    }, [session, accessToken, shouldFetchAddresses, dispatch]);

    return (
        <div className="w-full block relative">
            <Loading show={checkoutLoading} />
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 relative">
                {addresses.length > 0 &&
                    addresses.map((address) => {
                        const { name, addressId } = address;

                        return (
                            <Address id={addressId} name={name} isShipping={isShipping} key={`address-${addressId}`} />
                        );
                    })}
            </div>
        </div>
    );
};

export default ExistingAddress;
