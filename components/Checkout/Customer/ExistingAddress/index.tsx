import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { MdAddCircleOutline } from 'react-icons/md';
import Link from 'next/link';

import Address from './Address';
import selector from './selector';
import Loading from '../../../Loading';
import { fetchAddresses, setIsLoadingAddressBook } from '../../../../store/slices/account';
import { parseAsString, safelyParse } from '../../../../utils/parsers';

const LIMIT = 10;
const SKIP = 0;

interface ExistingAddressProps {
    isShipping: boolean;
}

const ExistingAddress: React.FC<ExistingAddressProps> = ({ isShipping }) => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const { addresses, isLoadingAddressBook } = useSelector(selector);
    const userId = safelyParse(session, 'user.id', parseAsString, null);

    useEffect(() => {
        if (userId) {
            dispatch(setIsLoadingAddressBook(true));
            dispatch(fetchAddresses({ userId, limit: LIMIT, skip: SKIP }));
            dispatch(setIsLoadingAddressBook(false));
        }
    }, [userId, dispatch]);

    return (
        <div className="w-full block relative">
            <Loading show={isLoadingAddressBook} />
            {addresses.length > 0 ? (
                addresses.map(({ _id, title, ...address }) => (
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 relative" key={`address-${_id}`}>
                        <Address id={_id} title={title} {...address} isShipping={isShipping} />
                    </div>
                ))
            ) : (
                <div className="flex flex-col w-full items-center">
                    <Link
                        href={{
                            pathname: '/account/[slug]',
                            query: { slug: 'add-address' },
                        }}
                        passHref
                    >
                        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-center w-full rounded-md shadow-md h-full">
                            <MdAddCircleOutline className="mb-2 text-2xl" />
                            <p>No saved addresses available, add one?</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ExistingAddress;
