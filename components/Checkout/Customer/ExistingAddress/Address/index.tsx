import React, { useCallback, useEffect, useState } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { BsCheck2Circle } from 'react-icons/bs';

import { CommerceLayerResponse } from '../../../../../types/api';
import { getAddress } from '../../../../../utils/account';
import { parseAsString, safelyParse } from '../../../../../utils/parsers';
import selector from './selector';
import { setCheckoutLoading } from '../../../../../store/slices/global';

interface AddressProps {
    id: string;
    name: string;
    isShipping: boolean;
}

export const Address: React.FC<AddressProps> = ({ id, name, isShipping }) => {
    const { cloneBillingAddressId, cloneShippingAddressId } = useSelector(selector);
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
        dispatch(setCheckoutLoading(true));
        /* const res = await updateAddressClone(accessToken, orderId, id, isShipping);

            if (res) {
                const addressPayload = parseAddress(address);

                if (isShipping) {
                    dispatch(setCloneShippingAddressId(id));
                    dispatch(setShippingAddress(addressPayload));
                } else {
                    dispatch(setCloneBillingAddressId(id));
                    dispatch(setBillingAddress(addressPayload));
                }
            } */

        dispatch(setCheckoutLoading(false));
    };

    const fetchAddress = useCallback(async (token: string, addressId: string) => {
        const res = await getAddress(token, addressId);

        if (res) {
            setAddress(res);
        }
    }, []);

    useEffect(() => {
        if (id && shouldFetchAddress) {
            // Stop multiple requests using internal state.
            setShouldFetchAddress(false);

            //fetchAddress(accessToken, id);
        }
    }, [id, shouldFetchAddress, fetchAddress]);

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
                <div className="text-xs w-full">
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
