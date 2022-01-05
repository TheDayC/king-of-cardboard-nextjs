import React from 'react';
import Link from 'next/link';
import { BiTrash, BiEdit } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';
import { deleteAddress } from '../../../../utils/account';
import { addError, addSuccess } from '../../../../store/slices/alerts';

interface AddressProps {
    id: string;
    name: string;
    fetchAddresses(shouldFetch: boolean): void;
}

export const Address: React.FC<AddressProps> = ({ id, name, fetchAddresses }) => {
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();

    const handleDelete = async () => {
        if (accessToken && id) {
            const res = await deleteAddress(accessToken, id);

            if (res) {
                dispatch(addSuccess('Address deleted!'));
                fetchAddresses(true);
            } else {
                dispatch(addError('Failed to delete address.'));
            }
        }
    };

    return (
        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-start w-full rounded-md shadow-md">
            <p className="text-sm mb-4">{name}</p>
            <div className="flex flex-row w-full justify-between">
                <Link
                    href={{
                        pathname: '/account/editAddress/[addressId]',
                        query: { addressId: id },
                    }}
                    passHref
                >
                    <button type="submit" className="btn btn-md rounded-md">
                        <BiEdit className="inline-block text-xl" />
                    </button>
                </Link>
                <button type="submit" className="btn btn-md btn-error rounded-md text-white" onClick={handleDelete}>
                    <BiTrash className="inline-block text-xl" />
                </button>
            </div>
        </div>
    );
};

export default Address;
