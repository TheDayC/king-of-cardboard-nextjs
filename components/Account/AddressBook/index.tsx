import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import selector from './selector';
import Achievements from '../../../services/achievments';
import { Achievement, Objective as ObjectiveType } from '../../../types/achievements';
import Loading from '../../Loading';
import Objective from './Objective';
import { getAddresses } from '../../../utils/account';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Add from './Add';
import { CommerceLayerResponse } from '../../../types/api';
import Address from './Address';
import Pagination from '../../Pagination';

const PER_PAGE = 5;

export const AddressBook: React.FC = () => {
    const { accessToken } = useSelector(selector);
    const { data: session } = useSession();
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const [shouldFetchAddresses, setShouldFetchAddresses] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [addresses, setAddresses] = useState<CommerceLayerResponse[] | null>(null);
    const [pageCount, setPageCount] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchAddresses = async (token: string, email: string, page: number) => {
        const addressData = await getAddresses(token, email, PER_PAGE, page);

        if (addressData) {
            setAddresses(addressData.addresses);
            setPageCount(addressData.meta ? addressData.meta.page_count : null);
        }

        setIsLoading(false);
    };

    const handlePageNumber = (nextPage: number) => {
        const clPage = nextPage + 1;

        if (accessToken && emailAddress) {
            setCurrentPage(nextPage);
            fetchAddresses(accessToken, emailAddress, clPage);
        }
    };

    // Fetch achievements
    useEffect(() => {
        const clPage = currentPage + 1;

        if (shouldFetchAddresses && accessToken && emailAddress && clPage > 0) {
            fetchAddresses(accessToken, emailAddress, clPage);
            setShouldFetchAddresses(false);
        }
    }, [accessToken, emailAddress, shouldFetchAddresses, currentPage]);

    return (
        <div className="flex flex-col relative w-full">
            <Loading show={isLoading} />
            <div className="grid grid-cols-4 gap-4">
                {addresses &&
                    addresses.map((address) => (
                        <Address id={address.id} name={address.attributes.name} key={`address-${address.id}`} />
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
