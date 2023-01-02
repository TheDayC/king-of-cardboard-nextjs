import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { BsCheck2Circle } from 'react-icons/bs';

import selector from './selector';
import { setCheckoutLoading } from '../../../../../store/slices/global';
import {
    setBillingAddress,
    setExistingBillingAddressId,
    setExistingShippingAddressId,
    setShippingAddress,
} from '../../../../../store/slices/checkout';

interface AddressProps {
    id: string;
    title: string;
    lineOne: string;
    lineTwo: string;
    company: string;
    city: string;
    postcode: string;
    county: string;
    isShipping: boolean;
}

export const Address: React.FC<AddressProps> = ({
    id,
    title,
    lineOne,
    lineTwo,
    company,
    postcode,
    city,
    county,
    isShipping,
}) => {
    const { existingBillingAddressId, existingShippingAddressId } = useSelector(selector);
    const dispatch = useDispatch();
    const isSelected = isShipping
        ? Boolean(existingShippingAddressId === id)
        : Boolean(existingBillingAddressId === id);

    const handleClick = async () => {
        dispatch(setCheckoutLoading(true));

        const address = {
            lineOne,
            lineTwo,
            company,
            city,
            postcode,
            county,
        };

        if (isShipping) {
            dispatch(setShippingAddress(address));
            dispatch(setExistingShippingAddressId(id));
        } else {
            dispatch(setBillingAddress(address));
            dispatch(setExistingBillingAddressId(id));
        }
    };

    return (
        <div
            className={`flex flex-col cursor-pointer p-3 border border-solid justify-start items-start w-full rounded-md shadow-md ${
                isSelected ? 'border-success' : 'border-base-200'
            }`}
            onClick={handleClick}
        >
            <div className="flex flex-row justify-start align-start space-x-2">
                {isSelected ? (
                    <BsCheck2Circle className="text-success" />
                ) : (
                    <IoLocationSharp className="text-secondary text-xl" />
                )}
                <div className="text-xs w-full">
                    <p className="mb-2 font-bold">{title}</p>
                    <p>
                        {lineOne} - {postcode}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Address;
