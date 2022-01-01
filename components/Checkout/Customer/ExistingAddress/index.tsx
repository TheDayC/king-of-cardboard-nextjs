import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { getAddresses } from '../../../../utils/account';
import { AlertLevel } from '../../../../enums/system';
import { isArrayOfErrors } from '../../../../utils/typeguards';
import { addAlert } from '../../../../store/slices/alerts';
import { CommerceLayerResponse } from '../../../../types/api';
import { setCheckoutLoading } from '../../../../store/slices/global';
import Address from './Address';
import selector from './selector';
import Loading from '../../../Loading';

const PER_PAGE = 6;

interface ExistingAddressProps {
    isShipping: boolean;
}

const ExistingAddress: React.FC<ExistingAddressProps> = ({ isShipping }) => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const { accessToken, checkoutLoading } = useSelector(selector);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [addresses, setAddresses] = useState<CommerceLayerResponse[] | null>(null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);

    const fetchAddresses = useCallback(
        async (token: string, email: string, page: number) => {
            const res = await getAddresses(token, email, PER_PAGE, page);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                setAddresses(res.addresses);
            }

            dispatch(setCheckoutLoading(false));
        },
        [dispatch]
    );

    useEffect(() => {
        if (session && shouldFetchAddresses && accessToken && emailAddress) {
            setShouldFetchAddresses(false);
            dispatch(setCheckoutLoading(true));
            fetchAddresses(accessToken, emailAddress, 1);
        }
    }, [session, accessToken, emailAddress, shouldFetchAddresses, dispatch, fetchAddresses]);

    return (
        <div className="w-full block relative">
            <Loading show={checkoutLoading} />
            <div className="grid grid-cols-2 gap-4 px-4 md:grid-cols-3 relative">
                {addresses &&
                    addresses.map((address) => {
                        const id = safelyParse(address, 'relationships.address.data.id', parseAsString, '');
                        const name = safelyParse(address, 'attributes.name', parseAsString, '');

                        return <Address id={id} name={name} isShipping={isShipping} key={`address-${id}`} />;
                    })}
            </div>
        </div>
    );
};

export default ExistingAddress;
