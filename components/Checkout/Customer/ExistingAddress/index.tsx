import React from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { MdAddCircleOutline } from 'react-icons/md';
import Link from 'next/link';

import Address from './Address';
import selector from './selector';
import Loading from '../../../Loading';
import { FormErrors } from '../../../../types/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';

interface ExistingAddressProps {
    isShipping: boolean;
    error: string | null;
}

const ExistingAddress: React.FC<ExistingAddressProps> = ({ isShipping, error }) => {
    const { addresses, isLoadingAddressBook } = useSelector(selector);
    return (
        <div className="flex flex-col w-full block relative space-y-4">
            <Loading show={isLoadingAddressBook} />
            {error && <p className="text-error text-sm">{error}</p>}
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
                        <div className="flex flex-col cursor-pointer p-6 border border-solid border-base-200 justify-center items-center w-full rounded-md shadow-md h-full space-y-4">
                            <MdAddCircleOutline className="w-5 h-5" />
                            <p className="text-md text-center">No saved addresses available, add one?</p>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ExistingAddress;
