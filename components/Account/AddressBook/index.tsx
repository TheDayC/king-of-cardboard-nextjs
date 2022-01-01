import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Loading from '../../Loading';
import { getAddresses } from '../../../utils/account';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Add from './Add';
import { CommerceLayerResponse } from '../../../types/api';
import Address from './Address';
import Pagination from '../../Pagination';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';

const PER_PAGE = 7;

export const AddressBook: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState<CommerceLayerResponse[] | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const dispatch = useDispatch();

    const fetchAddresses = useCallback(
        async (token: string, email: string, page: number) => {
            const res = await getAddresses(token, email, PER_PAGE, page);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                const { addresses, meta } = res;
                setAddresses(addresses);
                setPageCount(meta ? meta.page_count : null);
            }

            setIsLoading(false);
        },
        [dispatch]
    );

    const handlePageNumber = (nextPage: number) => {
        const clPage = nextPage + 1;

        if (accessToken && emailAddress) {
            setCurrentPage(nextPage);
            fetchAddresses(accessToken, emailAddress, clPage);
        }
    };

    useEffect(() => {
        const clPage = currentPage + 1;

        if (shouldFetchAddresses && accessToken && emailAddress && clPage > 0) {
            fetchAddresses(accessToken, emailAddress, clPage);
            setIsLoading(true);
            setShouldFetchAddresses(false);
        }
    }, [accessToken, emailAddress, shouldFetchAddresses, currentPage, fetchAddresses]);

    return (
        <div className="flex flex-col relative w-full">
            <Loading show={isLoading} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {addresses &&
                    addresses.map((address) => (
                        <Address
                            id={address.id}
                            name={safelyParse(address, 'attributes.name', parseAsString, '')}
                            key={`address-${address.id}`}
                            fetchAddresses={setShouldFetchAddresses}
                        />
                    ))}
                <Add />
            </div>
            {pageCount && pageCount > 1 && (
                <div className="flex flex-row w-full justify-center items-center">
                    <Pagination currentPage={currentPage} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                </div>
            )}
        </div>
    );
};

export default AddressBook;
