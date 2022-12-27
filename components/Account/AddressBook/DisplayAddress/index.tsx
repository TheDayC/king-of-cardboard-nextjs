import React from 'react';
import Link from 'next/link';
import { BiTrash, BiEdit } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';

import { addSuccess } from '../../../../store/slices/alerts';
import { Address } from '../../../../types/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { fetchAddresses, deleteAddress, setIsLoadingAddressBook } from '../../../../store/slices/account';

interface AddressProps {
    id: string;
    title: string;
    address: Address;
}

const LIMIT = 10;
const SKIP = 0;

export const DisplayAddress: React.FC<AddressProps> = ({ id, title, address }) => {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const { lineOne, lineTwo, company, postcode, county, country } = address;

    const handleDelete = async () => {
        dispatch(deleteAddress(id));
        dispatch(addSuccess('Address deleted!'));

        if (userId) {
            dispatch(setIsLoadingAddressBook(true));
            dispatch(fetchAddresses({ userId, limit: LIMIT, skip: SKIP }));
        }
    };

    return (
        <div className="flex flex-col p-6 border border-solid border-base-200 justify-center items-start w-full rounded-md shadow-md space-y-6">
            <div className="flex flex-col space-y-1">
                <h4 className="text-md font-semibold">{title}</h4>
                <p className="text-sm">{lineOne}</p>
                {lineTwo && <p className="text-sm">{lineTwo}</p>}
                {company && <p className="text-sm">{company}</p>}
                <p className="text-sm">{postcode}</p>
                <p className="text-sm">{county}</p>
                {country && <p className="text-sm">{country}</p>}
            </div>
            <div className="flex flex-row w-full justify-between">
                <Link
                    href={{
                        pathname: '/account/edit-address/[addressId]',
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

export default DisplayAddress;
