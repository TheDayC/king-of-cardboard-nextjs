import React, { useCallback, useEffect, useState } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { BsCheck2Circle } from 'react-icons/bs';

import { AlertLevel } from '../../../../../enums/system';
import { addAlert } from '../../../../../store/slices/alerts';
import {
    setShippingAddress,
    setBillingAddress,
    setCloneBillingAddressId,
    setCloneShippingAddressId,
} from '../../../../../store/slices/checkout';
import { CommerceLayerResponse } from '../../../../../types/api';
import { getAddress } from '../../../../../utils/account';
import { updateAddressClone } from '../../../../../utils/checkout';
import { parseAsString, safelyParse, parseAddress } from '../../../../../utils/parsers';
import { isArrayOfErrors } from '../../../../../utils/typeguards';
import selector from './selector';
import { setCheckoutLoading } from '../../../../../store/slices/global';

interface AddressProps {
    id: string;
    name: string;
    isShipping: boolean;
}

export const Address: React.FC<AddressProps> = ({ id, name, isShipping }) => {
    const { accessToken, orderId, cloneBillingAddressId, cloneShippingAddressId } = useSelector(selector);
    const [address, setAddress] = useState<CommerceLayerResponse | null>(null);
    const dispatch = useDispatch();
    const [shouldFetchAddress, setShouldFetchAddress] = useState(true);
    const lineOne = safelyParse(address, 'attributes.line_1', parseAsString, '');
    const lineTwo = safelyParse(address, 'attributes.line_2', parseAsString, '');
    const city = safelyParse(address, 'attributes.city', parseAsString, '');
    const postcode = safelyParse(address, 'attributes.zip_code', parseAsString, '');
    const county = safelyParse(address, 'attributes.state_code', parseAsString, '');
    const isSelected = isShipping ? Boolean(cloneShippingAddressId === id) : Boolean(cloneBillingAddressId === id);

    const handleClick = async () => {
        if (orderId && accessToken) {
            dispatch(setCheckoutLoading(true));
            const res = await updateAddressClone(accessToken, orderId, id, isShipping);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (res) {
                    if (isShipping) {
                        dispatch(setCloneShippingAddressId(id));
                    } else {
                        dispatch(setCloneBillingAddressId(id));
                    }

                    const addressPayload = parseAddress(address);

                    if (isShipping) {
                        dispatch(setShippingAddress(addressPayload));
                    } else {
                        dispatch(setBillingAddress(addressPayload));
                    }
                }
            }
            dispatch(setCheckoutLoading(false));
        }
    };

    const fetchAddress = useCallback(
        async (token: string, addressId: string) => {
            const res = await getAddress(token, addressId);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                setAddress(res);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (accessToken && id && shouldFetchAddress) {
            // Stop multiple requests using internal state.
            setShouldFetchAddress(false);

            fetchAddress(accessToken, id);
        }
    }, [id, accessToken, shouldFetchAddress, fetchAddress]);

    return (
        <div
            className="flex flex-col cursor-pointer p-3 border border-solid border-base-200 justify-start items-start w-full rounded-md shadow-md"
            onClick={handleClick}
        >
            <div className="flex flex-row justify-start align-start space-x-2">
                {isSelected ? (
                    <BsCheck2Circle className="text-success" />
                ) : (
                    <IoLocationSharp className="text-secondary text-xl" />
                )}
                <div className="text-xs w-3/4">
                    <p className="mb-2 font-bold">{name}</p>
                    <p>{lineOne}</p>
                    {lineTwo.length > 0 && <p>{lineTwo}</p>}
                    <p>{city}</p>
                    <p>{postcode}</p>
                    <p>{county}</p>
                </div>
            </div>
        </div>
    );
};

export default Address;
