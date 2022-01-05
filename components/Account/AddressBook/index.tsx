import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Loading from '../../Loading';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Add from './Add';
import Address from './Address';
import Pagination from '../../Pagination';
import { fetchAddresses, fetchAddressPageCount } from '../../../store/slices/account';

const PER_PAGE = 7;

export const AddressBook: React.FC = () => {
    const { accessToken, addresses, pageCount } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();

    const handlePageNumber = (nextPage: number) => {
        setIsLoading(true);
        const page = nextPage + 1;

        if (accessToken && emailAddress) {
            setCurrentPage(nextPage);
            dispatch(fetchAddresses({ accessToken, emailAddress, pageSize: PER_PAGE, page }));
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (shouldFetchAddresses && accessToken && emailAddress) {
            setShouldFetchAddresses(false);
            setIsLoading(true);
            dispatch(fetchAddresses({ accessToken, emailAddress, pageSize: PER_PAGE, page: 1 }));
            dispatch(fetchAddressPageCount({ accessToken, emailAddress }));
            setIsLoading(false);
        }
    }, [dispatch, accessToken, emailAddress, shouldFetchAddresses]);

    return (
        <div className="flex flex-col relative w-full">
            <Loading show={isLoading} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {addresses.length > 0 &&
                    addresses.map((address) => (
                        <Address
                            id={address.id}
                            name={address.name}
                            key={`address-${address.id}`}
                            fetchAddresses={setShouldFetchAddresses}
                        />
                    ))}
                <Add />
            </div>
            {pageCount > 1 && (
                <div className="flex flex-row w-full justify-center items-center">
                    <Pagination currentPage={currentPage} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                </div>
            )}
        </div>
    );
};

export default AddressBook;
